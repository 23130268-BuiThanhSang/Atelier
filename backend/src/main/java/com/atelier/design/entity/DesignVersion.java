package com.atelier.design.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "design_versions",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"design_id", "version_number"})})
@Getter
@Setter
@NoArgsConstructor
public class DesignVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "design_id", nullable = false)
    private Design design;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(name = "version_name", length = 150)
    private String versionName;

    @Column(name = "garment_color", length = 30)
    private String garmentColor;

    @Column(name = "preview_image_url", length = 500)
    private String previewImageUrl;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "DRAFT";

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
