package com.firealert.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for toggling device on/off (remote control)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceToggleRequest {
    
    @NotNull(message = "isEnabled flag is required")
    private Boolean isEnabled;
}
