package com.atelier.service;

import com.atelier.catalog.dto.AdminProductDetailDto;
import com.atelier.catalog.dto.AdminProductSummaryResponse;
import com.atelier.catalog.dto.AdminProductSummaryResponse.*;
import com.atelier.catalog.entity.Category;
import com.atelier.catalog.entity.Product;
import com.atelier.catalog.entity.ProductImage;
import com.atelier.catalog.entity.ProductVariant;
import com.atelier.repository.CategoryRepository;
import com.atelier.repository.ProductImageRepository;
import com.atelier.repository.ProductRepository;
import com.atelier.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public AdminProductSummaryResponse getAdminProducts(String keyword, String status, int page, int size) {
        // Chuẩn hóa param
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String dbStatus = mapStatusFilter(status);

        PageRequest pageRequest = PageRequest.of(Math.max(0, page), size);
        Page<Product> productPage = productRepository.findForAdmin(cleanKeyword, dbStatus, pageRequest);
        List<Product> products = productPage.getContent();

        if (products.isEmpty()) {
            KpiStats kpis = calculateKpis();
            return new AdminProductSummaryResponse(kpis, List.of(), page, size, productPage.getTotalElements(), productPage.getTotalPages());
        }

        List<Long> productIds = products.stream().map(Product::getId).toList();

        // 1. Lấy thông tin Tồn kho của từng sản phẩm từ ProductVariant
        List<Object[]> rawStocks = productVariantRepository.sumStockByProductIds(productIds);
        Map<Long, Long> stockMap = new HashMap<>();
        for (Object[] r : rawStocks) {
            stockMap.put((Long) r[0], ((Number) r[1]).longValue());
        }

        // 2. Lấy Danh mục
        Map<Long, String> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, Category::getName, (a, b) -> a));

        // 3. Lấy ảnh thumbnail
        List<Object[]> rawImages = productImageRepository.findThumbnailsByProductIds(productIds);
        Map<Long, String> imageMap = new HashMap<>();
        for (Object[] r : rawImages) {
            imageMap.put(((Number) r[0]).longValue(), (String) r[1]);
        }

        // 4. Map sang DTO Item
        List<ProductItem> items = products.stream().map(p -> {
            long stock = stockMap.getOrDefault(p.getId(), 0L);
            String pStatus = p.getStatus() != null ? p.getStatus() : "ACTIVE";

            String stockStatus;
            int stockPercent = Math.min(100, (int) ((stock / 200.0) * 100)); // Thanh tiến trình giả định mức 200 cái là 100%

            if ("INACTIVE".equalsIgnoreCase(pStatus)) {
                stockStatus = "hidden";
            } else if (stock == 0 || "OUT_OF_STOCK".equalsIgnoreCase(pStatus)) {
                stockStatus = "out-of-stock";
            } else if (stock <= 20) {
                stockStatus = "low-stock";
            } else {
                stockStatus = "in-stock";
            }

            String catName = (p.getCategory() != null) ? p.getCategory().getName() : "Chưa phân loại";
            String imgUrl = imageMap.getOrDefault(p.getId(), "https://picsum.photos/seed/" + p.getId() + "/120/120");

            return new ProductItem(
                    p.getId(),
                    p.getName(),
                    catName,
                    p.getBasePrice(),
                    stock,
                    stockPercent,
                    stockStatus,
                    pStatus,
                    p.getSoldCount() != null && p.getSoldCount() > 500, // featured nếu bán chạy
                    imgUrl
            );
        }).toList();

        KpiStats kpis = calculateKpis();
        return new AdminProductSummaryResponse(kpis, items, page, size, productPage.getTotalElements(), productPage.getTotalPages());
    }

    @Transactional
    public void toggleProductStatus(Long productId) {
        Product p = productRepository.findById(productId).orElseThrow();
        String newStatus = "ACTIVE".equalsIgnoreCase(p.getStatus()) ? "INACTIVE" : "ACTIVE";
        productRepository.updateProductStatus(productId, newStatus);
    }

    @Transactional
    public void bulkUpdateStatus(List<Long> productIds, String targetStatus) {
        if (productIds == null || productIds.isEmpty()) return;
        productRepository.updateBulkStatus(productIds, targetStatus);
    }

    private KpiStats calculateKpis() {
        long totalCategories = categoryRepository.count();
        long activeCount = productRepository.countByStatus("ACTIVE");
        long outOfStock = productRepository.countOutOfStockProducts();
        long lowStock = productRepository.countLowStockProducts();

        return new KpiStats(totalCategories, activeCount, lowStock, outOfStock);
    }

    private String mapStatusFilter(String rawStatus) {
        if ("Đang bán".equalsIgnoreCase(rawStatus)) return "ACTIVE";
        if ("Đang ẩn".equalsIgnoreCase(rawStatus)) return "INACTIVE";
        if ("Hết hàng".equalsIgnoreCase(rawStatus)) return "OUT_OF_STOCK";
        return null;
    }

    // Lấy chi tiết sản phẩm cho trang Edit
    @Transactional(readOnly = true)
    public AdminProductDetailDto.Response getProductDetail(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + id));

        String catName = (p.getCategory() != null) ? p.getCategory().getName() : "Chưa phân loại";
        Long catId = (p.getCategory() != null) ? p.getCategory().getId() : null;

        List<AdminProductDetailDto.ImageDto> images = productImageRepository.findByProductId(id).stream()
                .map(img -> new AdminProductDetailDto.ImageDto(img.getId(), img.getImageUrl(), Boolean.TRUE.equals(img.getIsThumbnail())))
                .toList();

        List<AdminProductDetailDto.VariantDto> variants = productVariantRepository.findByProductId(id).stream()
                .map(v -> new AdminProductDetailDto.VariantDto(v.getId(), v.getSize(), v.getSku(), v.getStockQuantity() != null ? v.getStockQuantity() : 0))
                .toList();

        return new AdminProductDetailDto.Response(
                p.getId(),
                p.getName(),
                p.getSlug(),
                p.getDescription(),
                catId,
                catName,
                p.getBasePrice(),
                p.getStatus(),
                images,
                variants
        );
    }

    // Tạo mới sản phẩm
    @Transactional
    public Long createProduct(AdminProductDetailDto.UpsertRequest req) {
        Product p = new Product();
        p.setName(req.name());
        p.setSlug(req.slug());
        p.setDescription(req.description());
        p.setBasePrice(req.basePrice());
        p.setStatus(req.status() != null ? req.status().toUpperCase() : "ACTIVE");

        if (req.categoryId() != null) {
            categoryRepository.findById(req.categoryId()).ifPresent(p::setCategory);
        }

        Product saved = productRepository.save(p);

        // Lưu variants
        if (req.variants() != null) {
            for (AdminProductDetailDto.VariantUpsertDto vDto : req.variants()) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(saved);
                variant.setSize(vDto.size().trim().toUpperCase());
                variant.setColor("Default");
                variant.setPrice(saved.getBasePrice());
                variant.setStatus("ACTIVE");
                // Luôn sinh SKU kèm ID sản phẩm vừa tạo
                variant.setSku("PRD" + saved.getId() + "-" + vDto.size().trim().toUpperCase());
                variant.setStockQuantity(vDto.stockQuantity());
                productVariantRepository.save(variant);
            }
        }

        return saved.getId();
    }

    // Cập nhật sản phẩm
    @Transactional
    public void updateProduct(Long id, AdminProductDetailDto.UpsertRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm id: " + id));

        p.setName(req.name());
        p.setSlug(req.slug());
        p.setDescription(req.description());
        p.setBasePrice(req.basePrice());
        p.setStatus(req.status() != null ? req.status().toUpperCase() : "ACTIVE");

        if (req.categoryId() != null) {
            categoryRepository.findById(req.categoryId()).ifPresent(p::setCategory);
        }

        productRepository.save(p);

        // Cập nhật biến thể tồn kho
        if (req.variants() != null && !req.variants().isEmpty()) {
            List<ProductVariant> existingVariants = productVariantRepository.findByProductId(id);

            for (AdminProductDetailDto.VariantUpsertDto vDto : req.variants()) {
                if (vDto.size() == null) continue;

                String targetSize = vDto.size().trim().toUpperCase();

                // Tìm variant cùng size đã tồn tại trong database
                ProductVariant matched = existingVariants.stream()
                        .filter(v -> v.getSize() != null && v.getSize().trim().equalsIgnoreCase(targetSize))
                        .findFirst()
                        .orElse(null);

                if (matched != null) {
                    matched.setStockQuantity(vDto.stockQuantity());
                    if (vDto.sku() != null && !vDto.sku().isBlank()) {
                        matched.setSku(vDto.sku().trim());
                    }
                    // Nếu variant cũ bị thiếu color thì gán fallback để tránh null
                    if (matched.getColor() == null) {
                        matched.setColor("Default");
                    }
                    if (matched.getPrice() == null) {
                        matched.setPrice(p.getBasePrice());
                    }
                    productVariantRepository.save(matched);
                } else {
                    // Nếu chưa có, tạo mới và BẮT BUỘC gán color, price, status
                    ProductVariant newVar = new ProductVariant();
                    newVar.setProduct(p);
                    newVar.setSize(targetSize);
                    newVar.setColor("Default");
                    newVar.setPrice(p.getBasePrice());
                    newVar.setStatus("ACTIVE");

                    // Sinh SKU duy nhất theo ID sản phẩm: PRD<id>-<size> (ví dụ PRD4-S)
                    String fallbackSku = "PRD" + p.getId() + "-" + targetSize;
                    if (vDto.sku() != null && !vDto.sku().isBlank() && !vDto.sku().equals("SKU-" + targetSize)) {
                        fallbackSku = vDto.sku().trim();
                    }
                    newVar.setSku(fallbackSku);
                    newVar.setStockQuantity(vDto.stockQuantity());

                    productVariantRepository.save(newVar);
                }
            }
        }
    }
}