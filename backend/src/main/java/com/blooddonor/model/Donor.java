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

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "eligibility_status")
    private EligibilityStatus eligibilityStatus = EligibilityStatus.Eligible;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private ApprovalStatus approvalStatus = ApprovalStatus.Approved;

    public enum BloodGroup { A_PLUS("A+"), A_MINUS("A-"), B_PLUS("B+"), B_MINUS("B-"),
                             AB_PLUS("AB+"), AB_MINUS("AB-"), O_PLUS("O+"), O_MINUS("O-");
        private final String value;
        BloodGroup(String value) { this.value = value; }
        public String getValue() { return value; }

        public static String normalize(String value) {
            if (value == null || value.isBlank()) {
                throw new IllegalArgumentException("Blood group is required");
            }
            String input = value.trim();
            for (BloodGroup bg : values()) {
                if (bg.value.equalsIgnoreCase(input) || bg.name().equalsIgnoreCase(input)) {
                    return bg.value;
                }
            }
            throw new IllegalArgumentException("Unknown blood group: " + value);
        }
    }

    public enum EligibilityStatus { Eligible, Ineligible, Pending }
    public enum ApprovalStatus { Pending, Approved, Rejected }
}
