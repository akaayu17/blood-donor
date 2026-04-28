package com.blooddonor.controller;

import com.blooddonor.dto.request.DonorRequest;
import com.blooddonor.dto.response.DonorResponse;
import com.blooddonor.service.DonorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final DonorService donorService;

    @GetMapping
    public ResponseEntity<List<DonorResponse>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonorResponse> getDonorById(@PathVariable Integer id) {
        return ResponseEntity.ok(donorService.getDonorById(id));
    }

    @PostMapping
    public ResponseEntity<DonorResponse> createDonor(@Valid @RequestBody DonorRequest req) {
        return ResponseEntity.ok(donorService.createDonor(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonorResponse> updateDonor(@PathVariable Integer id,
                                                      @RequestBody DonorRequest req) {
        return ResponseEntity.ok(donorService.updateDonor(id, req));
    }

    @PatchMapping("/{id}/eligibility")
    public ResponseEntity<DonorResponse> updateEligibility(@PathVariable Integer id,
                                                            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(donorService.updateEligibility(id, body.get("eligibilityStatus")));
    }
}
