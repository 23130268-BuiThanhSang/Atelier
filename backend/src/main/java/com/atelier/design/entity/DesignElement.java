package com.atelier.design.entity;

import com.atelier.file.entity.ArtworkAsset;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "design_elements")
@Getter
@Setter
@NoArgsConstructor
public class DesignElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "design_version_id", nullable = false)
    private DesignVersion designVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_asset_id")
    private ArtworkAsset artworkAsset;

    @Column(name = "side", nullable = false, length = 10)
    private String side;

    @Column(name = "element_type", nullable = false, length = 30)
    private String elementType;

    @Column(name = "text_content", columnDefinition = "text")
    private String textContent;

    @Column(name = "position_x", nullable = false, precision = 10, scale = 4)
    private BigDecimal positionX = BigDecimal.ZERO;

    @Column(name = "position_y", nullable = false, precision = 10, scale = 4)
    private BigDecimal positionY = BigDecimal.ZERO;

    @Column(name = "width", precision = 10, scale = 4)
    private BigDecimal width;

    @Column(name = "height", precision = 10, scale = 4)
    private BigDecimal height;

    @Column(name = "rotation", nullable = false, precision = 10, scale = 4)
    private BigDecimal rotation = BigDecimal.ZERO;

    @Column(name = "scale_x", nullable = false, precision = 10, scale = 4)
    private BigDecimal scaleX = BigDecimal.ONE;

    @Column(name = "scale_y", nullable = false, precision = 10, scale = 4)
    private BigDecimal scaleY = BigDecimal.ONE;

    @Column(name = "z_index", nullable = false)
    private Integer zIndex = 0;

    @Column(name = "font_family", length = 100)
    private String fontFamily;

    @Column(name = "font_size", precision = 10, scale = 2)
    private BigDecimal fontSize;

    @Column(name = "font_weight", length = 30)
    private String fontWeight;

    @Column(name = "color", length = 30)
    private String color;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
