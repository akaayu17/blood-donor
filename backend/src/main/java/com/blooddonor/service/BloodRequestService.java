package com.blooddonor.service;

import com.blooddonor.dto.request.BloodRequestDto;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.*;
import com.blooddonor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final BloodBankRepository bloodBankRepository;

    public List<Map<String, Object>> getAllRequests() {
        return bloodRequestRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return bloodRequestRepository.findByUserUserId(user.getUserId()).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public Map<String, Object> getRequestById(Integer id) {
        BloodRequest req = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BloodRequest", "id", id));
        return mapToResponse(req);
    }

    @Transactional
    public Map<String, Object> createRequest(BloodRequestDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        BloodBank bank = bloodBankRepository.findById(dto.getBankId())
                .orElseThrow(() -> new ResourceNotFoundException("BloodBank", "id", dto.getBankId()));

        BloodRequest request = BloodRequest.builder()
                .user(user)
                .bloodBank(bank)
                .bloodGroup(dto.getBloodGroup())
                .quantity(dto.getQuantity())
                .urgencyLevel(dto.getUrgencyLevel() != null ?
                        BloodRequest.UrgencyLevel.valueOf(dto.getUrgencyLevel()) : BloodRequest.UrgencyLevel.Medium)
                .requestDate(dto.getRequestDate())
                .status(BloodRequest.RequestStatus.Pending)
                .build();

        return mapToResponse(bloodRequestRepository.save(request));
    }

    @Transactional
    public Map<String, Object> updateStatus(Integer id, String status) {
        BloodRequest req = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BloodRequest", "id", id));
        req.setStatus(BloodRequest.RequestStatus.valueOf(status));
        return mapToResponse(bloodRequestRepository.save(req));
    }

    Map<String, Object> mapToResponse(BloodRequest r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("requestId", r.getRequestId());
        map.put("userId", r.getUser().getUserId());
        map.put("requesterName", r.getUser().getFullName());
        map.put("bankId", r.getBloodBank().getBankId());
        map.put("bankName", r.getBloodBank().getBankName());
        map.put("bloodGroup", r.getBloodGroup());
        map.put("quantity", r.getQuantity());
        map.put("urgencyLevel", r.getUrgencyLevel().name());
        map.put("requestDate", r.getRequestDate());
        map.put("status", r.getStatus().name());
        return map;
    }
}
