package com.firealert.backend.dto;

import com.firealert.backend.model.enums.AlertStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating alert status (clear or disable)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertStatusUpdateRequest {
    
    @NotNull(message = "Status is required")
    private AlertStatus status; // ACTIVE, CLEARED, DISABLED

    private String note;
}
