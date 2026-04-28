package com.blooddonor.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    @NotNull
    private LocalDate dateOfBirth;

    @NotBlank
    private String gender;

    private String address;
    private String phoneNumber;
}
