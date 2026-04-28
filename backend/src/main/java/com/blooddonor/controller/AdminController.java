package com.blooddonor.controller;

import com.blooddonor.dto.response.DashboardStatsResponse;
import com.blooddonor.repository.*;
import com.blooddonor.service.BloodStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodBankRepository bloodBankRepository;
    private final DonationRepository donationRepository;
    private final BloodStockService bloodStockService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        long lowStock = bloodStockService.getLowStock(BigDecimal.valueOf(100)).size();
        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalDonors(donorRepository.count())
                .totalRequests(bloodRequestRepository.count())
                .totalBloodBanks(bloodBankRepository.count())
                .lowStockAlerts(lowStock)
                .pendingRequests(bloodRequestRepository.findAll().stream()
                        .filter(r -> r.getStatus().name().equals("Pending")).count())
                .totalDonations(donationRepository.count())
                .build();
        return ResponseEntity.ok(stats);
    }
}
