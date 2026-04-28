package com.blooddonor.service;

import com.blooddonor.dto.response.UserResponse;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.User;
import com.blooddonor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(AuthService::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return AuthService.mapToResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Integer id, User.Role role, String fullName, String address) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        if (fullName != null) user.setFullName(fullName);
        if (address != null) user.setAddress(address);
        if (role != null) user.setRole(role);
        return AuthService.mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User", "id", id);
        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponse updateRole(Integer id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setRole(User.Role.valueOf(role));
        return AuthService.mapToResponse(userRepository.save(user));
    }
}
