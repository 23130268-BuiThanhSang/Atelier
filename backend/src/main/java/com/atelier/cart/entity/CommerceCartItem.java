package com.atelier.cart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "commerce_cart_items")
@Getter
@Setter
@NoArgsConstructor
public class CommerceCartItem {

    @Id
    @Column(name = "id", nullable = false, length = 64)
    private String id;

    @Column(name = "customer_ref", nullable = false, length = 64)
    private String customerRef;

    @Column(name = "name", nullable = false, length = 160)
    private String name;

    @Column(name = "note", length = 255)
    private String note;

    @Column(name = "price", nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "type", nullable = false, length = 32)
    private String type;

    @Column(name = "variant_label", nullable = false, length = 160)
    private String variantLabel;
}
