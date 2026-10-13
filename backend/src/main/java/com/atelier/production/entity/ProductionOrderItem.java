package com.atelier.production.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "production_order_items",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"production_order_id", "size_label"})})
@Getter
@Setter
@NoArgsConstructor
public class ProductionOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "production_order_id", nullable = false)
    private ProductionOrder productionOrder;

    @Column(name = "size_label", nullable = false, length = 20)
    private String sizeLabel;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}
