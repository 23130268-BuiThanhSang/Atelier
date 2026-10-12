package com.atelier.design.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "garment_colors",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"garment_id", "color_name"})})
@Getter
@Setter
@NoArgsConstructor
public class GarmentColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "garment_id", nullable = false)
    private Garment garment;

    @Column(name = "color_name", nullable = false, length = 50)
    private String colorName;

    @Column(name = "hex_code", nullable = false, length = 10)
    private String hexCode;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
