package com.atelier.catalog.dto;

import java.math.BigDecimal;
import java.util.List;

public record AdminProductSummaryResponse(
        KpiStats kpis,
        List<ProductItem> items,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
    public record KpiStats(
            long totalCategories,
            long activeCount,
            long lowStockCount,
            long outOfStockCount
    ) {}

    public record ProductItem(
            Long id,
            String name,
            String categoryName,
            BigDecimal price,
            long totalStock,
            int stockPercent,
            String stockStatus, // "in-stock", "low-stock", "out-of-stock", "hidden"
            String status,      // "ACTIVE", "INACTIVE", "OUT_OF_STOCK"
            boolean featured,
            String imageUrl
    ) {}

    public record BulkStatusRequest(
            List<Long> productIds,
            String targetStatus
    ) {}
}