package com.blooddonor.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsResponse {
    private long totalDonors;
    private long totalRequests;
    private long totalBloodBanks;
    private long lowStockAlerts;
    private long pendingRequests;
    private long totalDonations;
}
