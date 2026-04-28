package com.blooddonor.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DonationRequest {
    @NotNull
    private Integer donorId;

    @NotNull
    private Integer bankId;

    @NotNull
    private LocalDate donationDate;

    @NotNull @DecimalMin("0.01")
    private BigDecimal quantity;
}
