package com.blooddonor.service;

import com.blooddonor.dto.request.LoginRequest;
import com.blooddonor.dto.request.RegisterRequest;
import com.blooddonor.dto.response.AuthResponse;
import com.blooddonor.dto.response.UserResponse;
import com.blooddonor.exception.ResourceNotFoundException;
import com.blooddonor.model.User;
import com.blooddonor.model.UserPhone;
import com.blooddonor.repository.UserRepository;
import com.blooddonor.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .dateOfBirth(req.getDateOfBirth())
                .gender(User.Gender.valueOf(req.getGender()))
                .role(User.Role.User)
                .address(req.getAddress())
                .build();

        if (req.getPhoneNumber() != null && !req.getPhoneNumber().isBlank()) {
            UserPhone phone = UserPhone.builder().user(user).phoneNumber(req.getPhoneNumber()).build();
            user.getPhones().add(phone);
        }

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        String token = jwtTokenProvider.generateTokenFromEmail(req.getEmail());
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", req.getEmail()));

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToResponse(user))
                .build();
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToResponse(user);
    }

    public static UserResponse mapToResponse(User user) {
        List<String> phones = user.getPhones() == null ? List.of() :
                user.getPhones().stream().map(UserPhone::getPhoneNumber).collect(Collectors.toList());
        return UserResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender().name())
                .role(user.getRole().name())
                .address(user.getAddress())
                .phones(phones)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
