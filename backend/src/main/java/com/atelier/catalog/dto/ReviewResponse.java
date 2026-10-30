package com.atelier.catalog.dto;

import java.time.LocalDateTime;

/** Một đánh giá sản phẩm trả về cho giao diện. */
public record ReviewResponse(
        Long id,
        Integer rating,
        String comment,
        String authorName,
        String authorAvatarUrl,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean mine
) {
}
