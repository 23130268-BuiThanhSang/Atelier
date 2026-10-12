package com.atelier.production.entity;

import com.atelier.design.entity.Garment;
import com.atelier.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "producer_profiles")
@Getter
@Setter
@NoArgsConstructor
public class ProducerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "business_name", nullable = false, length = 200)
    private String businessName;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "address", columnDefinition = "text")
    private String address;

    @Column(name = "province", length = 100)
    private String province;

    @Column(name = "moq", nullable = false)
    private Integer moq = 1;

    @Column(name = "monthly_capacity")
    private Integer monthlyCapacity;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    @Column(name = "price_min", precision = 15, scale = 2)
    private BigDecimal priceMin;

    @Column(name = "price_max", precision = 15, scale = 2)
    private BigDecimal priceMax;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus = "UNVERIFIED";

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(name = "is_accepting_orders", nullable = false)
    private Boolean isAcceptingOrders = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "producer_garments",
            joinColumns = @JoinColumn(name = "producer_id"),
            inverseJoinColumns = @JoinColumn(name = "garment_id"))
    private Set<Garment> garments = new HashSet<>();
}
