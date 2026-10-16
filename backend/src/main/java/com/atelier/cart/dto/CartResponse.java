package com.atelier.cart.dto;

import java.math.BigDecimal;
import java.util.List;

/** DTO trả về toàn bộ giỏ hàng của một người dùng. */
public record CartResponse(
        Long userId,
        List<CartItemResponse> items,
        Integer itemCount,
        BigDecimal subtotal
) {
}
