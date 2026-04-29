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
    private final UserRepository userRepository;

    public List<Map<String, Object>> getAllDonations() {
        return donationRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getDonationsByDonor(Integer donorId) {
        return donationRepository.findByDonorDonorId(donorId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMyDonations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        Donor donor = donorRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile", "userId", user.getUserId()));
        return getDonationsByDonor(donor.getDonorId());
    }

    @Transactional
    public Map<String, Object> createDonation(DonationRequest req, String email) {
        User actor = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Donor donor;
        if (actor.getRole() == User.Role.Admin) {
            if (req.getDonorId() == null) {
                throw new IllegalArgumentException("donorId is required for admin donation entry");
            }
            donor = donorRepository.findById(req.getDonorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", req.getDonorId()));
        } else {
            donor = donorRepository.findByUserUserId(actor.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Create donor profile first before donating blood"));
            if (donor.getApprovalStatus() != Donor.ApprovalStatus.Approved) {
                throw new IllegalArgumentException("Your donor registration is pending admin approval");
            }
            if (donor.getEligibilityStatus() != Donor.EligibilityStatus.Eligible) {
                throw new IllegalArgumentException("You are not currently eligible to donate blood");
            }
        }

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

        // If screening passed -> add to stock
        if (newStatus == Donation.ScreeningStatus.Passed && oldStatus != Donation.ScreeningStatus.Passed) {
            String bgValue = donation.getDonor().getBloodGroup();
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
        map.put("bloodGroup", d.getDonor().getBloodGroup());
        map.put("bankId", d.getBloodBank().getBankId());
        map.put("bankName", d.getBloodBank().getBankName());
        map.put("donationDate", d.getDonationDate());
        map.put("quantity", d.getQuantity());
        map.put("screeningStatus", d.getScreeningStatus().name());
        return map;
    }
}
