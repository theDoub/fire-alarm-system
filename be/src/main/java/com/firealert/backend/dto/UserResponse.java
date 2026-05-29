package com.firealert.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.firealert.backend.model.enums.UserRole;

/**
 * DTO for user response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private UUID userId;
    private String email;
    private String fullName;
    private String phone;
    private UserRole role;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
