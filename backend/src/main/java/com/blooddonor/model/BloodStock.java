package com.blooddonor.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "blood_stock",
       uniqueConstraints = @UniqueConstraint(name = "uq_bank_bg", columnNames = {"bank_id", "blood_group"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BloodStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_id")
    private Integer stockId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", nullable = false)
    private BloodBank bloodBank;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(name = "quantity", nullable = false, precision = 8, scale = 2)
    private BigDecimal quantity = BigDecimal.ZERO;
}
