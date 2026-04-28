package com.blooddonor.controller;

import com.blooddonor.service.FulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fulfillments")
@RequiredArgsConstructor
public class FulfillmentController {

    private final FulfillmentService fulfillmentService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFulfillments() {
        return ResponseEntity.ok(fulfillmentService.getAllFulfillments());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> fulfillRequest(@RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(fulfillmentService.fulfillRequest(body.get("requestId")));
    }
}
