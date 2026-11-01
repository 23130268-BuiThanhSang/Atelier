package com.atelier.catalog.dto;

import java.util.List;

/** Trang danh sách đánh giá dành cho quản trị viên. */
public record AdminReviewPageResponse(
        List<AdminReviewResponse> items,
        int page,
        int size,
        long totalItems,
        int totalPages
) {
}
