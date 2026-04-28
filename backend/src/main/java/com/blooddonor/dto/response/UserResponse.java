package com.blooddonor.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private String role;
    private String address;
    private List<String> phones;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
