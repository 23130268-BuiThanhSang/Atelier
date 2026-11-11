package com.atelier.ai.dto;

/** Dữ liệu gửi sang AI server để phân tích một bình luận đánh giá. */
public record AiPredictRequest(String comment) {
}
