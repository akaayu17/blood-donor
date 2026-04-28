package com.blooddonor.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "request_fulfillment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RequestFulfillment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fulfillment_id")
    private Integer fulfillmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest bloodRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private BloodStock stock;

    @Column(name = "quantity_provided", nullable = false, precision = 8, scale = 2)
    private BigDecimal quantityProvided;

    @Column(name = "fulfillment_date", nullable = false)
    private LocalDate fulfillmentDate;
}
