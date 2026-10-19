package com.atelier.service;

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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

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
        // 1. Kích hoạt upload song song ảnh preview và tất cả layer ảnh Base64
        CompletableFuture<String> previewUploadFuture = CompletableFuture.supplyAsync(() -> {
            if (request.previewImageUrl() != null && request.previewImageUrl().startsWith("data:image")) {
                try {
                    return cloudinaryService.uploadBase64(request.previewImageUrl(), "designs");
                } catch (Exception e) {
                    log.error("Lỗi khi upload ảnh preview lên Cloudinary: {}", e.getMessage(), e);
                    return request.previewImageUrl();
                }
            }
            return request.previewImageUrl();
        });

        List<SaveDesignRequest.ElementDto> rawElements = request.elements() != null ? request.elements() : List.of();
        List<CompletableFuture<String>> layerUploadFutures = new ArrayList<>();

        for (SaveDesignRequest.ElementDto elDto : rawElements) {
            if ("image".equalsIgnoreCase(elDto.elementType()) && elDto.imageUrl() != null) {
                if (elDto.imageUrl().startsWith("data:image")) {
                    layerUploadFutures.add(CompletableFuture.supplyAsync(() -> {
                        try {
                            return cloudinaryService.uploadBase64(elDto.imageUrl(), "designs/layers");
                        } catch (Exception e) {
                            log.error("Lỗi khi upload layer ảnh lên Cloudinary: {}", e.getMessage(), e);
                            return elDto.imageUrl();
                        }
                    }));
                } else {
                    layerUploadFutures.add(CompletableFuture.completedFuture(elDto.imageUrl()));
                }
            } else {
                layerUploadFutures.add(CompletableFuture.completedFuture(null));
            }
        }

        // 2. Xử lý lưu hoặc cập nhật thực thể Design
        Design design;
        int nextVersionNumber = 1;

        if (request.designId() != null) {
            design = designRepository.findById(request.designId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu thiết kế #" + request.designId()));
            design.setName(request.name());
            designRepository.save(design);

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
            design.setVisibility("PRIVATE");
            design = designRepository.save(design);
        }

        // Chờ kết quả upload của ảnh preview
        String uploadedPreviewUrl = previewUploadFuture.join();

        // 3. Tạo bản ghi DesignVersion mới
        DesignVersion version = new DesignVersion();
        version.setDesign(design);
        version.setVersionNumber(nextVersionNumber);
        version.setVersionName("Phiên bản " + nextVersionNumber);
        version.setGarmentColor(request.garmentColor());
        version.setPreviewImageUrl(uploadedPreviewUrl);
        version.setStatus("SAVED");
        version = designVersionRepository.save(version);

        // 4. Lấy toàn bộ kết quả upload của các layer và lưu hàng loạt (batch save)
        List<DesignElement> elementsToSave = new ArrayList<>();
        int zIndex = 1;

        for (int i = 0; i < rawElements.size(); i++) {
            SaveDesignRequest.ElementDto elDto = rawElements.get(i);
            DesignElement el = new DesignElement();
            el.setDesignVersion(version);
            el.setSide(elDto.side());
            el.setElementType(elDto.elementType());

            if ("image".equalsIgnoreCase(elDto.elementType())) {
                String uploadedLayerUrl = layerUploadFutures.get(i).join();
                el.setTextContent(uploadedLayerUrl);
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

            elementsToSave.add(el);
        }

        if (!elementsToSave.isEmpty()) {
            designElementRepository.saveAll(elementsToSave);
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
        String designerName = "Atelier Designer";
        if (design.getUser() != null) {
            String fn = design.getUser().getFullName();
            if (fn != null && !fn.trim().isEmpty()) {
                designerName = fn.trim();
            } else if (design.getUser().getEmail() != null) {
                designerName = design.getUser().getEmail().split("@")[0];
            }
        }

        Optional<DesignVersion> latestVerOpt = designVersionRepository
                .findTopByDesignIdOrderByVersionNumberDesc(design.getId());

        if (latestVerOpt.isEmpty()) {
            return new MyDesignResponse(
                    design.getId(), design.getName(),
                    design.getVisibility() != null ? design.getVisibility() : "PRIVATE",
                    null, 1, "#F5F2DC", null,null, designerName, List.of()
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
                designerName,
                elementDtos
        );
    }

    @Transactional(readOnly = true)
    public List<MyDesignResponse> getPublicDesigns() {
        List<Design> publicDesigns = designRepository.findByVisibilityIgnoreCaseOrderByIdDesc("PUBLIC");
        return publicDesigns.stream().map(this::mapToMyDesignResponse).toList();
    }
}