package com.blooddonor.controller;

import com.blooddonor.dto.response.BloodStockResponse;
import com.blooddonor.service.BloodStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blood-stock")
@RequiredArgsConstructor
public class BloodStockController {

    private final BloodStockService bloodStockService;

    @GetMapping
    public ResponseEntity<List<BloodStockResponse>> getAllStock() {
        return ResponseEntity.ok(bloodStockService.getAllStock());
    }

    @GetMapping("/bank/{bankId}")
    public ResponseEntity<List<BloodStockResponse>> getStockByBank(@PathVariable Integer bankId) {
        return ResponseEntity.ok(bloodStockService.getStockByBank(bankId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodStockResponse> updateStock(@PathVariable Integer id,
                                                           @RequestBody Map<String, BigDecimal> body) {
        return ResponseEntity.ok(bloodStockService.updateStock(id, body.get("quantity")));
    }

    @GetMapping("/low")
    public ResponseEntity<List<BloodStockResponse>> getLowStock(
            @RequestParam(defaultValue = "100") BigDecimal threshold) {
        return ResponseEntity.ok(bloodStockService.getLowStock(threshold));
    }
}
