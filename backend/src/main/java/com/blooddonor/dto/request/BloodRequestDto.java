package com.blooddonor.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BloodRequestDto {
    @NotNull
    private Integer bankId;

    @NotBlank
    private String bloodGroup;

    @NotNull @DecimalMin("0.01")
    private BigDecimal quantity;

    private String urgencyLevel;

    @NotNull
    private LocalDate requestDate;
}
