package com.blooddonor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "donor")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donor_id")
    private Integer donorId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "eligibility_status")
    private EligibilityStatus eligibilityStatus = EligibilityStatus.Eligible;

    public enum BloodGroup { A_PLUS("A+"), A_MINUS("A-"), B_PLUS("B+"), B_MINUS("B-"),
                             AB_PLUS("AB+"), AB_MINUS("AB-"), O_PLUS("O+"), O_MINUS("O-");
        private final String value;
        BloodGroup(String value) { this.value = value; }
        public String getValue() { return value; }

        public static BloodGroup fromValue(String v) {
            for (BloodGroup bg : values()) {
                if (bg.value.equals(v)) return bg;
            }
            throw new IllegalArgumentException("Unknown blood group: " + v);
        }
    }

    public enum EligibilityStatus { Eligible, Ineligible, Pending }
}
