package com.blooddonor.controller;

import com.blooddonor.dto.request.BloodBankRequest;
import com.blooddonor.service.BloodBankService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blood-banks")
@RequiredArgsConstructor
public class BloodBankController {

    private final BloodBankService bloodBankService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllBanks() {
        return ResponseEntity.ok(bloodBankService.getAllBanks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBankById(@PathVariable Integer id) {
        return ResponseEntity.ok(bloodBankService.getBankById(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBank(@Valid @RequestBody BloodBankRequest req) {
        return ResponseEntity.ok(bloodBankService.createBank(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBank(@PathVariable Integer id,
                                                           @Valid @RequestBody BloodBankRequest req) {
        return ResponseEntity.ok(bloodBankService.updateBank(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBank(@PathVariable Integer id) {
        bloodBankService.deleteBank(id);
        return ResponseEntity.noContent().build();
    }
}
