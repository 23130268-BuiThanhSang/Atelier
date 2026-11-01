package com.atelier.catalog.dto;

import jakarta.validation.constraints.NotBlank;

/** Yêu cầu ẩn/hiện đánh giá từ quản trị viên. */
public record UpdateReviewStatusRequest(
        @NotBlank(message = "Trạng thái không được để trống")
        String status
) {
}
