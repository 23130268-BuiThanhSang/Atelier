package com.atelier.design.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "design_textures",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"design_version_id", "side"})})
@Getter
@Setter
@NoArgsConstructor
public class DesignTexture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "design_version_id", nullable = false)
    private DesignVersion designVersion;

    @Column(name = "side", nullable = false, length = 10)
    private String side;

    @Column(name = "texture_url", nullable = false, length = 500)
    private String textureUrl;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
