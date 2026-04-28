package com.blooddonor.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "blood_bank")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BloodBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bank_id")
    private Integer bankId;

    @Column(name = "bank_name", nullable = false, length = 150)
    private String bankName;

    @Column(name = "location", nullable = false, columnDefinition = "TEXT")
    private String location;

    @Column(name = "license_number", nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @OneToMany(mappedBy = "bloodBank", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BloodBankPhone> phones = new ArrayList<>();

    @OneToMany(mappedBy = "bloodBank", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BloodStock> stocks = new ArrayList<>();
}
