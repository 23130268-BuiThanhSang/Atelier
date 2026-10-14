package com.atelier.catalog.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** DTO dành riêng cho danh sách sản phẩm trên Catalog; không trả Entity ra API. */
public record ProductCatalogResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String imageUrl,
        List<String> colors,
        List<String> sizes,
        Integer viewCount,
        Integer soldCount,
        LocalDateTime createdAt,
        Double averageRating,
        Long reviewCount
) {
}
