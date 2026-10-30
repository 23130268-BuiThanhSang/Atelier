package com.atelier.catalog.dto;

/**
 * Trạng thái đánh giá của người dùng hiện tại với một sản phẩm.
 * reason: CAN_REVIEW, NOT_LOGGED_IN, NOT_PURCHASED hoặc ALREADY_REVIEWED.
 */
public record MyReviewResponse(
        boolean canReview,
        String reason,
        ReviewResponse review
) {
}
