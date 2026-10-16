package com.atelier.cart.dto;

import java.math.BigDecimal;

/** DTO trả về chi tiết một mặt hàng trong giỏ hàng. */
public record CartItemResponse(
        Long cartItemId,
        Long variantId,
        Long productId,
        String productName,
        String imageUrl,
        String size,
        String color,
        BigDecimal price,
        Integer quantity,
        Integer stockQuantity,
        BigDecimal lineTotal
) {
}
