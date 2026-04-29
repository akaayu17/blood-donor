package com.blooddonor.controller;

import com.blooddonor.dto.request.DonorRequest;
import com.blooddonor.dto.response.DonorResponse;
import com.blooddonor.service.DonorService;
import com.blooddonor.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final DonorService donorService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<DonorResponse>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonorResponse> getDonorById(@PathVariable Integer id) {
        return ResponseEntity.ok(donorService.getDonorById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<DonorResponse> getMyDonorProfile(Authentication auth) {
        Integer userId = userService.getCurrentUserEntity(auth.getName()).getUserId();
        return ResponseEntity.ok(donorService.getDonorByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<DonorResponse> createDonor(@Valid @RequestBody DonorRequest req) {
        return ResponseEntity.ok(donorService.createDonor(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<DonorResponse> updateDonor(@PathVariable Integer id,
                                                      @RequestBody DonorRequest req) {
        return ResponseEntity.ok(donorService.updateDonor(id, req));
    }

    @PatchMapping("/{id}/eligibility")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<DonorResponse> updateEligibility(@PathVariable Integer id,
                                                            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(donorService.updateEligibility(id, body.get("eligibilityStatus")));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<DonorResponse>> getPendingApprovals() {
        return ResponseEntity.ok(donorService.getPendingApprovals());
    }

    @PostMapping("/apply")
    public ResponseEntity<DonorResponse> applyForDonor(@RequestBody Map<String, String> body, Authentication auth) {
        return ResponseEntity.ok(donorService.applyForDonorRole(auth.getName(), body.get("bloodGroup")));
    }

    @PatchMapping("/{id}/approval")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<DonorResponse> updateApproval(@PathVariable Integer id,
                                                        @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(donorService.updateApprovalStatus(id, body.get("approvalStatus")));
    }
}
