package com.atelier.payment.entity;

import com.atelier.order.entity.CommerceOrder;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "commerce_payments")
@Getter
@Setter
@NoArgsConstructor
public class CommercePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "escrow_status", nullable = false)
    private EscrowStatus escrowStatus;

    @Column(name = "method", nullable = false, length = 40)
    private String method;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "provider_reference", nullable = false, unique = true, length = 80)
    private String providerReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CommercePaymentStatus status;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CommerceOrder order;
}
