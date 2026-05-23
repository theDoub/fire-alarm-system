package com.firealert.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firealert.backend.dto.AuthResponse;
import com.firealert.backend.dto.LoginRequest;
import com.firealert.backend.dto.UserRegistrationRequest;
import com.firealert.backend.dto.UserResponse;
import com.firealert.backend.model.entities.User;
import com.firealert.backend.repository.UserRepository;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.security.JwtTokenProvider;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(UserRegistrationRequest request){
        if (userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email is already registered!");
        }
        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null && !request.getPhone().isBlank()){
            user.setPhone(request.getPhone().trim());
        }

        User savedUser = userRepository.save(user);
        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = jwtTokenProvider.generateToken(userDetails);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(toUserResponse(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request){
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail().trim().toLowerCase(),
                request.getPassword()
            )
        );
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
        String token = jwtTokenProvider.generateToken(userDetails);
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(toUserResponse(user))
                .build();
    }

    @Transactional
    public UserResponse getCurrentUser(CustomUserDetails currentUser){
        User user = userRepository.findById(currentUser.getId())
                        .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user){
        return UserResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
