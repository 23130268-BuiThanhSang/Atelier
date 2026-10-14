package com.atelier.catalog.dto;

import java.math.BigDecimal;

/** Dữ liệu biến thể công khai dùng tại trang chi tiết sản phẩm. */
public record ProductVariantResponse(
        Long id,
        String sku,
        String size,
        String color,
        BigDecimal price,
        Integer stockQuantity
) {
}
