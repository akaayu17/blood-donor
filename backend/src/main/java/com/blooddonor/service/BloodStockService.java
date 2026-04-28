package com.blooddonor.service;

import com.blooddonor.dto.response.BloodStockResponse;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.BloodStock;
import com.blooddonor.repository.BloodStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodStockService {

    private final BloodStockRepository bloodStockRepository;

    public List<BloodStockResponse> getAllStock() {
        return bloodStockRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<BloodStockResponse> getStockByBank(Integer bankId) {
        return bloodStockRepository.findByBloodBankBankId(bankId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public BloodStockResponse updateStock(Integer id, BigDecimal quantity) {
        BloodStock stock = bloodStockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BloodStock", "id", id));
        stock.setQuantity(quantity);
        return mapToResponse(bloodStockRepository.save(stock));
    }

    public List<BloodStockResponse> getLowStock(BigDecimal threshold) {
        return bloodStockRepository.findLowStock(threshold).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    BloodStockResponse mapToResponse(BloodStock s) {
        return BloodStockResponse.builder()
                .stockId(s.getStockId())
                .bankId(s.getBloodBank().getBankId())
                .bankName(s.getBloodBank().getBankName())
                .bloodGroup(s.getBloodGroup())
                .quantity(s.getQuantity())
                .build();
    }
}
