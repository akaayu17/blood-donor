package com.blooddonor.service;

import com.blooddonor.dto.request.DonationRequest;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.*;
import com.blooddonor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;
    private final BloodBankRepository bloodBankRepository;
    private final BloodStockRepository bloodStockRepository;

    public List<Map<String, Object>> getAllDonations() {
        return donationRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getDonationsByDonor(Integer donorId) {
        return donationRepository.findByDonorDonorId(donorId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createDonation(DonationRequest req) {
        Donor donor = donorRepository.findById(req.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", req.getDonorId()));
        BloodBank bank = bloodBankRepository.findById(req.getBankId())
                .orElseThrow(() -> new ResourceNotFoundException("BloodBank", "id", req.getBankId()));

        Donation donation = Donation.builder()
                .donor(donor)
                .bloodBank(bank)
                .donationDate(req.getDonationDate())
                .quantity(req.getQuantity())
                .screeningStatus(Donation.ScreeningStatus.Pending)
                .build();

        Donation saved = donationRepository.save(donation);

        // Update donor's last donation date
        donor.setLastDonationDate(req.getDonationDate());
        donorRepository.save(donor);

        return mapToResponse(saved);
    }

    @Transactional
    public Map<String, Object> updateScreening(Integer id, String status) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation", "id", id));
        Donation.ScreeningStatus newStatus = Donation.ScreeningStatus.valueOf(status);
        Donation.ScreeningStatus oldStatus = donation.getScreeningStatus();
        donation.setScreeningStatus(newStatus);

        // If screening passed → add to stock
        if (newStatus == Donation.ScreeningStatus.Passed && oldStatus != Donation.ScreeningStatus.Passed) {
            String bgValue = donation.getDonor().getBloodGroup().getValue();
            Integer bankId = donation.getBloodBank().getBankId();
            BloodStock stock = bloodStockRepository.findByBloodBankBankIdAndBloodGroup(bankId, bgValue)
                    .orElse(BloodStock.builder().bloodBank(donation.getBloodBank()).bloodGroup(bgValue)
                            .quantity(java.math.BigDecimal.ZERO).build());
            stock.setQuantity(stock.getQuantity().add(donation.getQuantity()));
            bloodStockRepository.save(stock);
        }

        return mapToResponse(donationRepository.save(donation));
    }

    Map<String, Object> mapToResponse(Donation d) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("donationId", d.getDonationId());
        map.put("donorId", d.getDonor().getDonorId());
        map.put("donorName", d.getDonor().getUser().getFullName());
        map.put("bloodGroup", d.getDonor().getBloodGroup().getValue());
        map.put("bankId", d.getBloodBank().getBankId());
        map.put("bankName", d.getBloodBank().getBankName());
        map.put("donationDate", d.getDonationDate());
        map.put("quantity", d.getQuantity());
        map.put("screeningStatus", d.getScreeningStatus().name());
        return map;
    }
}
