package com.atelier.order.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "commerce_orders")
@Getter
@Setter
@NoArgsConstructor
public class CommerceOrder {

    @Id
    @Column(name = "id", nullable = false, length = 32)
    private String id;

    @Column(name = "current_stage", nullable = false, length = 80)
    private String currentStage;

    @Column(name = "customer_name", nullable = false, length = 120)
    private String customerName;

    @Column(name = "customer_ref", nullable = false, length = 64)
    private String customerRef;

    @Column(name = "due_date_label", length = 32)
    private String dueDateLabel;

    @Column(name = "estimated_delivery")
    private LocalDate estimatedDelivery;

    @Column(name = "item_count", nullable = false)
    private Integer itemCount;

    @Column(name = "payment_method", length = 80)
    private String paymentMethod;

    @Column(name = "placed_at", nullable = false)
    private LocalDate placedAt;

    @Column(name = "producer_name", nullable = false, length = 160)
    private String producerName;

    @Column(name = "producer_ref", nullable = false, length = 64)
    private String producerRef;

    @Column(name = "product_name", nullable = false, length = 180)
    private String productName;

    @Column(name = "progress", nullable = false)
    private Integer progress;

    @Column(name = "review_allowed", nullable = false)
    private Boolean reviewAllowed;

    @Column(name = "shipping_address", length = 255)
    private String shippingAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CommerceOrderStatus status;

    @Column(name = "total", nullable = false, precision = 14, scale = 2)
    private BigDecimal total;

    @Column(name = "units", nullable = false)
    private Integer units;

    @Column(name = "variant_label", nullable = false, length = 160)
    private String variantLabel;
}
