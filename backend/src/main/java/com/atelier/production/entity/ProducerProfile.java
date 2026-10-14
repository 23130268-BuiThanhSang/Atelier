package com.atelier.production.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.atelier.user.entity.User;

@Entity
@Table(name = "producer_profiles")
@Data
public class ProducerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user; // Khóa ngoại nối sang bảng users

    @Column(name = "business_name") private String businessName;
    @Column(name = "description", columnDefinition = "TEXT") private String description;
    @Column(name = "logo_url") private String logoUrl;
    @Column(name = "cover_url") private String coverUrl;
    @Column(name = "contact_phone") private String contactPhone;
    @Column(name = "address") private String address;
    @Column(name = "province") private String province;
    @Column(name = "moq") private Integer moq;
    @Column(name = "monthly_capacity") private Integer monthlyCapacity;
    @Column(name = "lead_time_days") private Integer leadTimeDays;
    @Column(name = "price_min") private Double priceMin;
    @Column(name = "price_max") private Double priceMax;
    @Column(name = "verification_status") private String verificationStatus = "UNVERIFIED";
    @Column(name = "status") private String status = "ACTIVE";
    @Column(name = "is_accepting_orders") private Boolean isAcceptingOrders = true;

    @Column(name = "created_at") private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at") private LocalDateTime updatedAt = LocalDateTime.now();
}