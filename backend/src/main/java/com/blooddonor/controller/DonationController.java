package com.blooddonor.controller;

import com.blooddonor.dto.request.DonationRequest;
import com.blooddonor.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @GetMapping("/donor/{id}")
    public ResponseEntity<List<Map<String, Object>>> getDonationsByDonor(@PathVariable Integer id) {
        return ResponseEntity.ok(donationService.getDonationsByDonor(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createDonation(@Valid @RequestBody DonationRequest req) {
        return ResponseEntity.ok(donationService.createDonation(req));
    }

    @PatchMapping("/{id}/screening")
    public ResponseEntity<Map<String, Object>> updateScreening(@PathVariable Integer id,
                                                                @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(donationService.updateScreening(id, body.get("screeningStatus")));
    }
}
