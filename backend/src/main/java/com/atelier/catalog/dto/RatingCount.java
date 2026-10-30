package com.atelier.catalog.dto;

/** Số lượng đánh giá theo từng mức sao. */
public record RatingCount(
        Integer rating,
        Long total
) {
}
