package com.blooddonor.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DonorRequest {
    @NotNull
    private Integer userId;

    @NotBlank
    private String bloodGroup;

    private String eligibilityStatus;
}
