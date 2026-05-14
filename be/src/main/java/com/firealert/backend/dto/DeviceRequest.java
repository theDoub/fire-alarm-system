package com.firealert.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for device creation/update request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceRequest {
    
    @NotBlank(message = "Device name is required")
    @Size(min = 2, max = 255, message = "Device name must be between 2 and 255 characters")
    private String deviceName;
}
