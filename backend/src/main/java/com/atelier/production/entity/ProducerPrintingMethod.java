package com.atelier.production.entity;

import com.atelier.design.entity.PrintingMethod;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "producer_printing_methods")
@Getter
@Setter
@NoArgsConstructor
public class ProducerPrintingMethod {

    @EmbeddedId
    private ProducerPrintingMethodId id = new ProducerPrintingMethodId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("producerId")
    @JoinColumn(name = "producer_id", nullable = false)
    private ProducerProfile producer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("printingMethodId")
    @JoinColumn(name = "printing_method_id", nullable = false)
    private PrintingMethod printingMethod;

    @Column(name = "min_unit_price", precision = 15, scale = 2)
    private BigDecimal minUnitPrice;
}
