package com.atelier.catalog.dto;

import java.util.Map;

/** Điểm tổng hợp và phân bố số sao của một sản phẩm. */
public record ReviewSummaryResponse(
        Double averageRating,
        Long totalReviews,
        Map<Integer, Long> distribution
) {
}
