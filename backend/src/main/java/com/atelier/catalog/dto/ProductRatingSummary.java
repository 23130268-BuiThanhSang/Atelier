package com.atelier.catalog.dto;

/** Kết quả tổng hợp điểm đánh giá theo từng sản phẩm. */
public record ProductRatingSummary(
        Long productId,
        Double averageRating,
        Long reviewCount
) {
}
