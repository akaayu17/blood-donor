package com.blooddonor.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BloodStockResponse {
    private Integer stockId;
    private Integer bankId;
    private String bankName;
    private String bloodGroup;
    private BigDecimal quantity;
}
