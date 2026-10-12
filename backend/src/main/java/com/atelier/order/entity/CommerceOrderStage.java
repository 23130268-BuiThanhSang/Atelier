package com.atelier.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "commerce_order_stages")
@Getter
@Setter
@NoArgsConstructor
public class CommerceOrderStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "caption", nullable = false, length = 80)
    private String caption;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "label", nullable = false, length = 80)
    private String label;

    @Column(name = "state", nullable = false, length = 24)
    private String state;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CommerceOrder order;
}
