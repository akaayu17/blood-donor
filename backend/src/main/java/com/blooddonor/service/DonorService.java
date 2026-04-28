package com.blooddonor.service;

import com.blooddonor.dto.request.DonorRequest;
import com.blooddonor.dto.response.DonorResponse;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.Donor;
import com.blooddonor.model.User;
import com.blooddonor.repository.DonorRepository;
import com.blooddonor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    public List<DonorResponse> getAllDonors() {
        return donorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DonorResponse getDonorById(Integer id) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", id));
        return mapToResponse(donor);
    }

    @Transactional
    public DonorResponse createDonor(DonorRequest req) {
        if (donorRepository.existsByUserUserId(req.getUserId())) {
            throw new IllegalArgumentException("User is already registered as a donor");
        }
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", req.getUserId()));

        Donor donor = Donor.builder()
                .user(user)
                .bloodGroup(Donor.BloodGroup.fromValue(req.getBloodGroup()))
                .eligibilityStatus(Donor.EligibilityStatus.Eligible)
                .build();

        user.setRole(User.Role.Donor);
        userRepository.save(user);
        return mapToResponse(donorRepository.save(donor));
    }

    @Transactional
    public DonorResponse updateDonor(Integer id, DonorRequest req) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", id));
        if (req.getBloodGroup() != null) donor.setBloodGroup(Donor.BloodGroup.fromValue(req.getBloodGroup()));
        if (req.getEligibilityStatus() != null)
            donor.setEligibilityStatus(Donor.EligibilityStatus.valueOf(req.getEligibilityStatus()));
        return mapToResponse(donorRepository.save(donor));
    }

    @Transactional
    public DonorResponse updateEligibility(Integer id, String status) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", id));
        donor.setEligibilityStatus(Donor.EligibilityStatus.valueOf(status));
        return mapToResponse(donorRepository.save(donor));
    }

    public DonorResponse mapToResponse(Donor d) {
        return DonorResponse.builder()
                .donorId(d.getDonorId())
                .userId(d.getUser().getUserId())
                .fullName(d.getUser().getFullName())
                .email(d.getUser().getEmail())
                .bloodGroup(d.getBloodGroup().getValue())
                .lastDonationDate(d.getLastDonationDate())
                .eligibilityStatus(d.getEligibilityStatus().name())
                .build();
    }
}
