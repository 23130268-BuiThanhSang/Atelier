package com.atelier.catalog.dto;

import java.time.LocalDateTime;

/** Một đánh giá trong màn quản trị. */
public record AdminReviewResponse(
        Long id,
        Long productId,
        String productName,
        String authorName,
        String authorEmail,
        Integer rating,
        String comment,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
