package com.atelier.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminOrderDto {

    public record ListItem(
            Long id,
            String orderCode,
            String customerName,
            String customerPhone,
            String shippingAddress,
            String productName,
            String productImage,
            int itemsCount,
            BigDecimal totalAmount,
            String status,
            LocalDateTime createdAt
    ) {}

    public record Detail(
            Long id,
            String orderCode,
            String customerName,
            String customerPhone,
            String shippingAddress,
            BigDecimal subtotal,
            BigDecimal shippingFee,
            BigDecimal discountAmount,
            BigDecimal totalAmount,
            String status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<OrderItemDto> items
    ) {}

    public record OrderItemDto(
            Long id,
            String productName,
            String productImage,
            String size,
            String color,
            int quantity,
            BigDecimal price
    ) {}

    public record KpiResponse(
            long totalOrders,
            long inProductionOrders,
            long pendingDeliveryOrders,
            long disputedOrders
    ) {}

    public record UpdateStatusRequest(
            String status
    ) {}
}