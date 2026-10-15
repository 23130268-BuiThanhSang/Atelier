package com.atelier.catalog.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** DTO chi tiết sản phẩm; không serialize trực tiếp JPA Entity. */
public record ProductDetailResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String imageUrl,
        List<String> imageUrls,
        List<String> colors,
        List<String> sizes,
        List<ProductVariantResponse> variants,
        Integer viewCount,
        Integer soldCount,
        LocalDateTime createdAt,
        Double averageRating,
        Long reviewCount
) {
}
