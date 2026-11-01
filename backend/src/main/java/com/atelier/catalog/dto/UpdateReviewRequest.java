package com.atelier.catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Dữ liệu người dùng gửi lên khi sửa đánh giá của mình. */
public record UpdateReviewRequest(
        @NotNull(message = "Vui lòng chọn số sao")
        @Min(value = 1, message = "Số sao tối thiểu là 1")
        @Max(value = 5, message = "Số sao tối đa là 5")
        Integer rating,

        @Size(max = 1200, message = "Nội dung đánh giá tối đa 1200 ký tự")
        String comment
) {
}
