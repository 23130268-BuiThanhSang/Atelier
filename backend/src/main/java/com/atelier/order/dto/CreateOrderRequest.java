package com.atelier.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CreateOrderRequest {

    @NotBlank(message = "Tên người nhận không được để trống")
    private String shippingName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String shippingPhone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    private String shippingAddress;

    private String note;

    private String paymentMethod = "COD";

    /**
     * Danh sách variantId của các món hàng được tích chọn trong giỏ hàng.
     * Nếu để trống hoặc null thì mặc định đặt toàn bộ sản phẩm trong giỏ.
     */
    private List<Long> selectedVariantIds;
}
