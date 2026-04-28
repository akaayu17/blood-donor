package com.blooddonor.service;

import com.blooddonor.exception.InsufficientStockException;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.*;
import com.blooddonor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FulfillmentService {

    private final FulfillmentRepository fulfillmentRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodStockRepository bloodStockRepository;

    public List<Map<String, Object>> getAllFulfillments() {
        return fulfillmentRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> fulfillRequest(Integer requestId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BloodRequest", "id", requestId));

        if (request.getStatus() != BloodRequest.RequestStatus.Pending) {
            throw new IllegalArgumentException("Request is already " + request.getStatus().name());
        }

        BloodStock stock = bloodStockRepository
                .findByBloodBankBankIdAndBloodGroup(request.getBloodBank().getBankId(), request.getBloodGroup())
                .orElseThrow(() -> new InsufficientStockException(
                        "No stock found for blood group " + request.getBloodGroup() +
                        " at bank " + request.getBloodBank().getBankName()));

        BigDecimal needed = request.getQuantity();
        if (stock.getQuantity().compareTo(needed) < 0) {
            throw new InsufficientStockException(
                    "Insufficient stock. Available: " + stock.getQuantity() + " ml, Requested: " + needed + " ml");
        }

        stock.setQuantity(stock.getQuantity().subtract(needed));
        bloodStockRepository.save(stock);

        request.setStatus(BloodRequest.RequestStatus.Fulfilled);
        bloodRequestRepository.save(request);

        RequestFulfillment fulfillment = RequestFulfillment.builder()
                .bloodRequest(request)
                .stock(stock)
                .quantityProvided(needed)
                .fulfillmentDate(LocalDate.now())
                .build();

        return mapToResponse(fulfillmentRepository.save(fulfillment));
    }

    Map<String, Object> mapToResponse(RequestFulfillment f) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("fulfillmentId", f.getFulfillmentId());
        map.put("requestId", f.getBloodRequest().getRequestId());
        map.put("requesterName", f.getBloodRequest().getUser().getFullName());
        map.put("bloodGroup", f.getBloodRequest().getBloodGroup());
        map.put("quantityProvided", f.getQuantityProvided());
        map.put("fulfillmentDate", f.getFulfillmentDate());
        map.put("bankName", f.getStock().getBloodBank().getBankName());
        return map;
    }
}
