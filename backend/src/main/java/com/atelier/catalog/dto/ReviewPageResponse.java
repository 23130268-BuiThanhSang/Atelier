package com.atelier.catalog.dto;

import java.util.List;

/** Trang danh sách đánh giá kèm phần tổng hợp. */
public record ReviewPageResponse(
        ReviewSummaryResponse summary,
        List<ReviewResponse> items,
        int page,
        int size,
        long totalItems,
        int totalPages
) {
}
