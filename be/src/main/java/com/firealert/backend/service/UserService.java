package com.firealert.backend.service;

import com.firealert.backend.dto.UserRegistrationRequest;
import com.firealert.backend.dto.UserResponse;
import com.firealert.backend.model.User;
import com.firealert.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

/**
 * Service for User management
 * Handles user registration, authentication, and profile management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * Register a new user
     */
    public UserResponse registerUser(UserRegistrationRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already registered");
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getUserId());
        
        return mapToResponse(savedUser);
    }
    
    /**
     * Get user by ID
     */
    public UserResponse getUserById(Integer userId) {
        log.debug("Fetching user by ID: {}", userId);
        
        return userRepository.findById(userId)
                .map(this::mapToResponse)
                .orElseThrow(() -> {
                    log.error("User not found: {}", userId);
                    return new RuntimeException("User not found");
                });
    }
    
    /**
     * Get user by email
     */
    public Optional<UserResponse> getUserByEmail(String email) {
        log.debug("Fetching user by email: {}", email);
        return userRepository.findByEmail(email).map(this::mapToResponse);
    }
    
    /**
     * Map User entity to UserResponse DTO
     */
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
