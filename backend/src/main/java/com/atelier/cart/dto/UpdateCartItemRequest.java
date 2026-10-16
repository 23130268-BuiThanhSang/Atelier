package com.atelier.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** Yêu cầu cập nhật số lượng sản phẩm trong giỏ hàng. */
@Data
public class UpdateCartItemRequest {

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
}
