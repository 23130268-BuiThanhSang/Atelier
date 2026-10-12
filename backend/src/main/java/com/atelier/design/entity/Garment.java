package com.atelier.design.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "garments")
@Getter
@Setter
@NoArgsConstructor
public class Garment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "model_3d_url", nullable = false, length = 500)
    private String model3dUrl;

    @Column(name = "uv_map_url", nullable = false, length = 500)
    private String uvMapUrl;

    @Column(name = "preview_front_url", length = 500)
    private String previewFrontUrl;

    @Column(name = "preview_back_url", length = 500)
    private String previewBackUrl;

    @Column(name = "gender", length = 30)
    private String gender;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
