package com.atelier.service;

import com.atelier.design.dto.DesignSaveDto;
import com.atelier.design.dto.MyDesignResponse;
import com.atelier.design.dto.SaveDesignRequest;
import com.atelier.design.entity.Design;
import com.atelier.design.entity.DesignElement;
import com.atelier.design.entity.DesignVersion;
import com.atelier.design.entity.Garment;
import com.atelier.repository.DesignElementRepository;
import com.atelier.repository.DesignRepository;
import com.atelier.repository.DesignVersionRepository;
import com.atelier.user.entity.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DesignService {

    private final DesignRepository designRepository;
    private final DesignVersionRepository designVersionRepository;
    private final DesignElementRepository designElementRepository;
    private final CloudinaryService cloudinaryService;
    private final EntityManager entityManager;

    @Transactional
    public Map<String, Object> saveDesign(SaveDesignRequest request, Long currentUserId) {
        Design design;
        int nextVersionNumber = 1;

        // 1. Kiểm tra xem đây là Chỉnh sửa thiết kế cũ hay Tạo mới
        if (request.designId() != null) {
            design = designRepository.findById(request.designId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiết kế #" + request.designId()));
            design.setName(request.name());
            designRepository.save(design);

            // Tìm version_number lớn nhất hiện tại của thiết kế này và tăng lên 1
            Optional<DesignVersion> latestVerOpt = designVersionRepository
                    .findTopByDesignIdOrderByVersionNumberDesc(design.getId());
            if (latestVerOpt.isPresent() && latestVerOpt.get().getVersionNumber() != null) {
                nextVersionNumber = latestVerOpt.get().getVersionNumber() + 1;
            }
        } else {
            design = new Design();
            design.setUser(entityManager.getReference(User.class, currentUserId != null ? currentUserId : 1L));
            design.setGarment(entityManager.getReference(Garment.class, request.garmentId() != null ? request.garmentId() : 1L));
            design.setName(request.name() != null ? request.name() : "Mẫu áo chưa đặt tên");
            design.setStatus("ACTIVE");
            design.setVisibility("PRIVATE"); // Mặc định là riêng tư
            design = designRepository.save(design);
        }

        // 2. Upload ảnh preview lên Cloudinary (giữ nguyên hàm upload Cloudinary hiện tại của bạn)
        String uploadedPreviewUrl = null;
        if (request.previewImageUrl() != null && request.previewImageUrl().startsWith("data:image")) {
            try {
                uploadedPreviewUrl = cloudinaryService.uploadBase64(request.previewImageUrl(), "designs");
                log.info("Uploaded preview image to Cloudinary: {}", uploadedPreviewUrl);
            } catch (Exception e) {
                log.error("Lỗi khi upload ảnh preview lên Cloudinary: {}", e.getMessage(), e);
            }
        } else {
            uploadedPreviewUrl = request.previewImageUrl();
        }

        // 3. Tạo bản ghi mới trong bảng design_versions với version_number đã tăng
        DesignVersion version = new DesignVersion();
        version.setDesign(design);
        version.setVersionNumber(nextVersionNumber);
        version.setVersionName("Phiên bản " + nextVersionNumber);
        version.setGarmentColor(request.garmentColor());
        version.setPreviewImageUrl(uploadedPreviewUrl);
        version.setStatus("SAVED");
        version = designVersionRepository.save(version);

        // 4. Lưu các phần tử chữ & ảnh vào bảng design_elements
        if (request.elements() != null) {
            int zIndex = 1;
            for (SaveDesignRequest.ElementDto elDto : request.elements()) {
                DesignElement el = new DesignElement();
                el.setDesignVersion(version);
                el.setSide(elDto.side());
                el.setElementType(elDto.elementType());

                // Nếu là text thì lưu nội dung chữ, nếu là image thì upload layer ảnh lên Cloudinary
                if ("image".equalsIgnoreCase(elDto.elementType()) && elDto.imageUrl() != null) {
                    try {
                        String uploadedLayerUrl = elDto.imageUrl().startsWith("data:image")
                                ? cloudinaryService.uploadBase64(elDto.imageUrl(), "designs/layers")
                                : elDto.imageUrl();
                        el.setTextContent(uploadedLayerUrl);
                    } catch (Exception e) {
                        log.error("Lỗi khi upload ảnh layer lên Cloudinary: {}", e.getMessage(), e);
                        el.setTextContent(elDto.imageUrl());
                    }
                } else {
                    el.setTextContent(elDto.textContent());
                }

                if (elDto.positionX() != null) el.setPositionX(BigDecimal.valueOf(elDto.positionX()));
                if (elDto.positionY() != null) el.setPositionY(BigDecimal.valueOf(elDto.positionY()));
                if (elDto.width() != null) el.setWidth(BigDecimal.valueOf(elDto.width()));
                if (elDto.height() != null) el.setHeight(BigDecimal.valueOf(elDto.height()));
                if (elDto.rotation() != null) el.setRotation(BigDecimal.valueOf(elDto.rotation()));
                el.setColor(elDto.color());
                if (elDto.fontSize() != null) {
                    el.setFontSize(BigDecimal.valueOf(elDto.fontSize()));
                }
                el.setFontFamily(elDto.fontFamily());
                el.setFontWeight(elDto.fontWeight());
                el.setZIndex(zIndex++);
                el.setIsVisible(true);
                designElementRepository.save(el);
            }
        }

        return Map.of(
                "designId", design.getId(),
                "versionId", version.getId(),
                "versionNumber", version.getVersionNumber(),
                "previewImageUrl", uploadedPreviewUrl
        );
    }

    @Transactional(readOnly = true)
    public List<MyDesignResponse> getMyDesigns(Long userId) {
        List<Design> designs = (userId != null)
                ? designRepository.findByUserIdOrderByIdDesc(userId)
                : designRepository.findAllByOrderByIdDesc();

        return designs.stream().map(this::mapToMyDesignResponse).toList();
    }

    @Transactional(readOnly = true)
    public MyDesignResponse getDesignById(Long designId) {
        Design design = designRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế #" + designId));
        return mapToMyDesignResponse(design);
    }

    @Transactional
    public MyDesignResponse toggleVisibility(Long designId) {
        Design design = designRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế #" + designId));

        String current = design.getVisibility();
        String next = "PUBLIC".equalsIgnoreCase(current) ? "PRIVATE" : "PUBLIC";
        design.setVisibility(next);
        designRepository.save(design);

        return mapToMyDesignResponse(design);
    }

    private MyDesignResponse mapToMyDesignResponse(Design design) {
        Optional<DesignVersion> latestVerOpt = designVersionRepository
                .findTopByDesignIdOrderByVersionNumberDesc(design.getId());

        if (latestVerOpt.isEmpty()) {
            return new MyDesignResponse(
                    design.getId(), design.getName(),
                    design.getVisibility() != null ? design.getVisibility() : "PRIVATE",
                    null, 1, "#F5F2DC", null, null, List.of()
            );
        }

        DesignVersion latestVer = latestVerOpt.get();
        List<DesignElement> elements = designElementRepository
                .findByDesignVersionIdOrderByIdAsc(latestVer.getId());

        List<SaveDesignRequest.ElementDto> elementDtos = elements.stream().map(el ->
                new SaveDesignRequest.ElementDto(
                        el.getSide(),
                        el.getElementType(),
                        "text".equalsIgnoreCase(el.getElementType()) ? el.getTextContent() : null,
                        "image".equalsIgnoreCase(el.getElementType()) ? el.getTextContent() : null,
                        el.getPositionX() != null ? el.getPositionX().doubleValue() : 0.0,
                        el.getPositionY() != null ? el.getPositionY().doubleValue() : 0.0,
                        el.getWidth() != null ? el.getWidth().doubleValue() : null,
                        el.getHeight() != null ? el.getHeight().doubleValue() : null,
                        el.getRotation() != null ? el.getRotation().doubleValue() : 0.0,
                        el.getColor(),
                        el.getFontSize() != null ? el.getFontSize().intValue() : null,
                        el.getFontFamily(),
                        el.getFontWeight()
                )
        ).toList();

        return new MyDesignResponse(
                design.getId(),
                design.getName(),
                design.getVisibility() != null ? design.getVisibility() : "PRIVATE",
                latestVer.getId(),
                latestVer.getVersionNumber(),
                latestVer.getGarmentColor(),
                latestVer.getPreviewImageUrl(),
                null,
                elementDtos
        );
    }
}