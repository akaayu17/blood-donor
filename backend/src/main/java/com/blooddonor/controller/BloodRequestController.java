package com.blooddonor.controller;

import com.blooddonor.dto.request.BloodRequestDto;
import com.blooddonor.service.BloodRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blood-requests")
@RequiredArgsConstructor
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyRequests(Authentication auth) {
        return ResponseEntity.ok(bloodRequestService.getMyRequests(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRequestById(@PathVariable Integer id) {
        return ResponseEntity.ok(bloodRequestService.getRequestById(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRequest(@Valid @RequestBody BloodRequestDto dto,
                                                              Authentication auth) {
        return ResponseEntity.ok(bloodRequestService.createRequest(dto, auth.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable Integer id,
                                                             @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bloodRequestService.updateStatus(id, body.get("status")));
    }
}
