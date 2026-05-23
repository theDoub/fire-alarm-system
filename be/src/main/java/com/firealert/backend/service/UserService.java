package com.firealert.backend.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firealert.backend.dto.UserResponse;
import com.firealert.backend.dto.UserUpdateRequest;
import com.firealert.backend.model.entities.User;
import com.firealert.backend.repository.UserRepository;

/**
 * Service for User management
 * Handles user registration, authentication, and profile management
 */
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId){
        User user = getUserOrThrow(userId);
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateCurrentUser(UUID userId, UserUpdateRequest request){
        User user = getUserOrThrow(userId);

        if (request.getFullName() != null && !request.getFullName().isBlank()){
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null){
            String phone = request.getPhone().trim();
            user.setPhone(phone.isBlank() ? null : phone);
        }
        return toResponse(userRepository.save(user));
    }

    private User getUserOrThrow(UUID userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private UserResponse toResponse(User user){
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
