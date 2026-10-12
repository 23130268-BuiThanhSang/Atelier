package com.atelier.design.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "garment_print_areas",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"garment_id", "side"})})
@Getter
@Setter
@NoArgsConstructor
public class GarmentPrintArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "garment_id", nullable = false)
    private Garment garment;

    @Column(name = "side", nullable = false, length = 10)
    private String side;

    @Column(name = "width_cm", nullable = false, precision = 6, scale = 2)
    private BigDecimal widthCm;

    @Column(name = "height_cm", nullable = false, precision = 6, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "uv_x", nullable = false, precision = 10, scale = 4)
    private BigDecimal uvX;

    @Column(name = "uv_y", nullable = false, precision = 10, scale = 4)
    private BigDecimal uvY;

    @Column(name = "uv_width", nullable = false, precision = 10, scale = 4)
    private BigDecimal uvWidth;

    @Column(name = "uv_height", nullable = false, precision = 10, scale = 4)
    private BigDecimal uvHeight;
}
