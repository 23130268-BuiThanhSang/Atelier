package com.atelier.production.entity;

import com.atelier.design.entity.DesignVersion;
import com.atelier.design.entity.Garment;
import com.atelier.design.entity.PrintingMethod;
import com.atelier.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "production_requests")
@Getter
@Setter
@NoArgsConstructor
public class ProductionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "request_code", nullable = false, unique = true, length = 50)
    private String requestCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "design_version_id", nullable = false)
    private DesignVersion designVersion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "garment_id", nullable = false)
    private Garment garment;

    @Column(name = "garment_color", nullable = false, length = 30)
    private String garmentColor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printing_method_id")
    private PrintingMethod printingMethod;

    @Column(name = "print_sides", nullable = false, length = 10)
    private String printSides = "FRONT";

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "budget_min", precision = 15, scale = 2)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", precision = 15, scale = 2)
    private BigDecimal budgetMax;

    @Column(name = "additional_requirements", columnDefinition = "text")
    private String additionalRequirements;

    @Column(name = "shipping_name", nullable = false, length = 150)
    private String shippingName;

    @Column(name = "shipping_phone", nullable = false, length = 20)
    private String shippingPhone;

    @Column(name = "shipping_address", nullable = false, columnDefinition = "text")
    private String shippingAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producer_id")
    private ProducerProfile producer;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "DRAFT";

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
