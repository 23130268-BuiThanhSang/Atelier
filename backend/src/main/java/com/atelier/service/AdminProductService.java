package com.atelier.service;

import com.atelier.catalog.dto.AdminProductSummaryResponse;
import com.atelier.catalog.dto.AdminProductSummaryResponse.*;
import com.atelier.catalog.entity.Category;
import com.atelier.catalog.entity.Product;
import com.atelier.catalog.entity.ProductImage;
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
}