package com.blooddonor.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_phone")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserPhone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phone_id")
    private Integer phoneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;
}
