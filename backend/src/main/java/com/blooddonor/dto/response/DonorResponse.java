package com.blooddonor.dto.response;

import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DonorResponse {
    private Integer donorId;
    private Integer userId;
    private String fullName;
    private String email;
    private String bloodGroup;
    private LocalDate lastDonationDate;
    private String eligibilityStatus;
}
