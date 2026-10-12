package com.atelier.production.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProducerPrintingMethodId implements Serializable {

    @Column(name = "producer_id")
    private Long producerId;

    @Column(name = "printing_method_id")
    private Long printingMethodId;
}
