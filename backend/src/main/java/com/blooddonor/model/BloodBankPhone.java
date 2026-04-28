package com.blooddonor.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blood_bank_phone")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BloodBankPhone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phone_id")
    private Integer phoneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", nullable = false)
    private BloodBank bloodBank;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;
}
