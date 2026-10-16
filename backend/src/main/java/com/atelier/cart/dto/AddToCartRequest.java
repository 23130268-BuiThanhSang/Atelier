package com.atelier.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** Yêu cầu thêm sản phẩm vào giỏ hàng. */
@Data
public class AddToCartRequest {

    @NotNull(message = "variantId là bắt buộc")
    private Long variantId;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity = 1;
}
