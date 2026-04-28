package com.blooddonor.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class BloodBankRequest {
    @NotBlank
    private String bankName;

    @NotBlank
    private String location;

    @NotBlank
    private String licenseNumber;

    private List<String> phoneNumbers;
}
