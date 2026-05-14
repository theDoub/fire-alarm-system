package com.firealert.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for user response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private Integer userId;
    private String email;
    private String fullName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
