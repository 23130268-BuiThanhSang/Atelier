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
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService; // Inject thêm CloudinaryService

    @Transactional(readOnly = true)
    public AdminProductSummaryResponse getAdminProducts(String keyword, String status, int page, int size) {
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

        List<Object[]> rawStocks = productVariantRepository.sumStockByProductIds(productIds);
        Map<Long, Long> stockMap = new HashMap<>();
        for (Object[] r : rawStocks) {
            stockMap.put((Long) r[0], ((Number) r[1]).longValue());
        }

        Map<Long, String> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, Category::getName, (a, b) -> a));

        List<Object[]> rawImages = productImageRepository.findThumbnailsByProductIds(productIds);
        Map<Long, String> imageMap = new HashMap<>();
        for (Object[] r : rawImages) {
            imageMap.put(((Number) r[0]).longValue(), (String) r[1]);
        }

        List<ProductItem> items = products.stream().map(p -> {
            long stock = stockMap.getOrDefault(p.getId(), 0L);
            String pStatus = p.getStatus() != null ? p.getStatus() : "ACTIVE";

            String stockStatus;
            int stockPercent = Math.min(100, (int) ((stock / 200.0) * 100));

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
                    p.getSoldCount() != null && p.getSoldCount() > 500,
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

    // 1. Tạo mới sản phẩm: Đồng bộ price của tất cả variant theo basePrice
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

        // Lưu hình ảnh sản phẩm vào product_images
        saveProductImages(saved, req.imageUrls());

        // Lưu biến thể variants: Cột price của tất cả size luôn bằng basePrice
        if (req.variants() != null) {
            for (AdminProductDetailDto.VariantUpsertDto vDto : req.variants()) {
                if (vDto.size() == null || vDto.size().isBlank()) continue;

                ProductVariant variant = new ProductVariant();
                variant.setProduct(saved);
                variant.setSize(vDto.size().trim().toUpperCase());
                variant.setColor("Default");
                variant.setPrice(saved.getBasePrice()); // Đồng bộ giá theo basePrice
                variant.setStatus("ACTIVE");
                variant.setSku("PRD" + saved.getId() + "-" + vDto.size().trim().toUpperCase());
                variant.setStockQuantity(vDto.stockQuantity() != null ? vDto.stockQuantity() : 0);
                productVariantRepository.save(variant);
            }
        }

        return saved.getId();
    }

    // 2. Cập nhật sản phẩm: Luôn đồng bộ price của tất cả size theo basePrice mới
    @Transactional
    public void updateProduct(Long id, AdminProductDetailDto.UpsertRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm id: " + id));

        p.setName(req.name());
        p.setSlug(req.slug());
        p.setDescription(req.description());
        p.setBasePrice(req.basePrice()); // Cập nhật basePrice mới cho Product
        p.setStatus(req.status() != null ? req.status().toUpperCase() : "ACTIVE");

        if (req.categoryId() != null) {
            categoryRepository.findById(req.categoryId()).ifPresent(p::setCategory);
        }

        productRepository.save(p);

        // Đồng bộ hình ảnh và dọn dẹp ảnh bị xóa trên Cloudinary
        if (req.imageUrls() != null) {
            List<ProductImage> oldImages = productImageRepository.findByProductId(id);
            List<String> newUrlList = req.imageUrls();

            List<String> urlsToDelete = oldImages.stream()
                    .map(ProductImage::getImageUrl)
                    .filter(oldUrl -> oldUrl != null && !newUrlList.contains(oldUrl))
                    .toList();

            productImageRepository.deleteByProductId(id);
            saveProductImages(p, req.imageUrls());

            if (!urlsToDelete.isEmpty()) {
                CompletableFuture.runAsync(() -> {
                    for (String delUrl : urlsToDelete) {
                        try {
                            cloudinaryService.deleteImageByUrl(delUrl);
                        } catch (Exception e) {
                            log.error("Không thể xóa ảnh thừa trên Cloudinary: {}", delUrl, e);
                        }
                    }
                });
            }
        }

        // Cập nhật biến thể tồn kho & Luôn ép giá price = basePrice mới cho toàn bộ các size
        List<ProductVariant> existingVariants = productVariantRepository.findByProductId(id);

        if (req.variants() != null && !req.variants().isEmpty()) {
            for (AdminProductDetailDto.VariantUpsertDto vDto : req.variants()) {
                if (vDto.size() == null || vDto.size().isBlank()) continue;

                String targetSize = vDto.size().trim().toUpperCase();

                ProductVariant matched = existingVariants.stream()
                        .filter(v -> v.getSize() != null && v.getSize().trim().equalsIgnoreCase(targetSize))
                        .findFirst()
                        .orElse(null);

                if (matched != null) {
                    matched.setStockQuantity(vDto.stockQuantity() != null ? vDto.stockQuantity() : 0);
                    if (vDto.sku() != null && !vDto.sku().isBlank()) {
                        matched.setSku(vDto.sku().trim());
                    }
                    if (matched.getColor() == null) {
                        matched.setColor("Default");
                    }
                    // LUÔN CẬP NHẬT LẠI GIÁ BẰNG BASE_PRICE MỚI CỦA SẢN PHẨM
                    matched.setPrice(p.getBasePrice());
                    productVariantRepository.save(matched);
                } else {
                    ProductVariant newVar = new ProductVariant();
                    newVar.setProduct(p);
                    newVar.setSize(targetSize);
                    newVar.setColor("Default");
                    // ĐỒNG BỘ GIÁ BẰNG BASE_PRICE
                    newVar.setPrice(p.getBasePrice());
                    newVar.setStatus("ACTIVE");

                    String fallbackSku = "PRD" + p.getId() + "-" + targetSize;
                    if (vDto.sku() != null && !vDto.sku().isBlank() && !vDto.sku().equals("SKU-" + targetSize)) {
                        fallbackSku = vDto.sku().trim();
                    }
                    newVar.setSku(fallbackSku);
                    newVar.setStockQuantity(vDto.stockQuantity() != null ? vDto.stockQuantity() : 0);

                    productVariantRepository.save(newVar);
                }
            }
        }

        // Đảm bảo an toàn: cập nhật giá cho tất cả các biến thể còn lại của sản phẩm này
        for (ProductVariant v : existingVariants) {
            if (!p.getBasePrice().equals(v.getPrice())) {
                v.setPrice(p.getBasePrice());
                productVariantRepository.save(v);
            }
        }
    }

    private void saveProductImages(Product product, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) return;

        List<ProductImage> imageEntities = new ArrayList<>();
        for (int i = 0; i < imageUrls.size(); i++) {
            String url = imageUrls.get(i);
            if (url != null && !url.isBlank()) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(url);
                img.setDisplayOrder(i);
                img.setIsThumbnail(i == 0);
                imageEntities.add(img);
            }
        }

        if (!imageEntities.isEmpty()) {
            productImageRepository.saveAll(imageEntities);
        }
    }
}