package com.atelier.admin.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "disputes")
@Getter
@Setter
@NoArgsConstructor
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "dispute_code", nullable = false, unique = true, length = 50)
    private String disputeCode;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "production_order_id")
    private Long productionOrderId;

    @Column(name = "opened_by", nullable = false)
    private Long openedBy;

    @Column(name = "case_type", nullable = false, length = 30)
    private String caseType = "DISPUTE";

    @Column(name = "reason_code", nullable = false, length = 50)
    private String reasonCode;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "evidence", columnDefinition = "json")
    private String evidence;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "OPEN";

    @Column(name = "assigned_admin_id")
    private Long assignedAdminId;

    @Column(name = "resolution", length = 30)
    private String resolution;

    @Column(name = "resolution_amount", precision = 15, scale = 2)
    private BigDecimal resolutionAmount;

    @Column(name = "resolution_note", columnDefinition = "text")
    private String resolutionNote;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
