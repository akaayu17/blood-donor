package com.blooddonor.service;

import com.blooddonor.dto.request.BloodBankRequest;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.BloodBank;
import com.blooddonor.model.BloodBankPhone;
import com.blooddonor.model.BloodStock;
import com.blooddonor.repository.BloodBankRepository;
import com.blooddonor.repository.BloodStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodBankService {

    private final BloodBankRepository bloodBankRepository;
    private final BloodStockRepository bloodStockRepository;

    private static final List<String> ALL_GROUPS = List.of("A+","A-","B+","B-","AB+","AB-","O+","O-");

    public List<Map<String, Object>> getAllBanks() {
        return bloodBankRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getBankById(Integer id) {
        BloodBank bank = bloodBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BloodBank", "id", id));
        return mapToResponse(bank);
    }

    @Transactional
    public Map<String, Object> createBank(BloodBankRequest req) {
        if (bloodBankRepository.existsByLicenseNumber(req.getLicenseNumber())) {
            throw new IllegalArgumentException("License number already exists: " + req.getLicenseNumber());
        }
        BloodBank bank = BloodBank.builder()
                .bankName(req.getBankName())
                .location(req.getLocation())
                .licenseNumber(req.getLicenseNumber())
                .build();

        if (req.getPhoneNumbers() != null) {
            req.getPhoneNumbers().forEach(ph -> {
                BloodBankPhone phone = BloodBankPhone.builder().bloodBank(bank).phoneNumber(ph).build();
                bank.getPhones().add(phone);
            });
        }
        BloodBank saved = bloodBankRepository.save(bank);

        // Initialize empty stock for all blood groups
        ALL_GROUPS.forEach(group -> {
            BloodStock stock = BloodStock.builder()
                    .bloodBank(saved).bloodGroup(group).quantity(BigDecimal.ZERO).build();
            bloodStockRepository.save(stock);
        });

        return mapToResponse(saved);
    }

    @Transactional
    public Map<String, Object> updateBank(Integer id, BloodBankRequest req) {
        BloodBank bank = bloodBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BloodBank", "id", id));
        bank.setBankName(req.getBankName());
        bank.setLocation(req.getLocation());
        bank.setLicenseNumber(req.getLicenseNumber());
        return mapToResponse(bloodBankRepository.save(bank));
    }

    @Transactional
    public void deleteBank(Integer id) {
        if (!bloodBankRepository.existsById(id)) throw new ResourceNotFoundException("BloodBank", "id", id);
        bloodBankRepository.deleteById(id);
    }

    Map<String, Object> mapToResponse(BloodBank bank) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("bankId", bank.getBankId());
        map.put("bankName", bank.getBankName());
        map.put("location", bank.getLocation());
        map.put("licenseNumber", bank.getLicenseNumber());
        map.put("phones", bank.getPhones() == null ? List.of() :
                bank.getPhones().stream().map(BloodBankPhone::getPhoneNumber).collect(Collectors.toList()));

        List<BloodStock> stocks = bloodStockRepository.findByBloodBankBankId(bank.getBankId());
        map.put("stocks", stocks.stream().map(s -> {
            Map<String, Object> sm = new LinkedHashMap<>();
            sm.put("stockId", s.getStockId());
            sm.put("bloodGroup", s.getBloodGroup());
            sm.put("quantity", s.getQuantity());
            return sm;
        }).collect(Collectors.toList()));
        return map;
    }
}
