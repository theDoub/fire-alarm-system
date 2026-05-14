package com.firealert.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating/triggering an alert
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertRequest {
    
    @NotNull(message = "Device ID is required")
    private Integer deviceId;
    
    @NotNull(message = "Alert level is required")
    private String alertLevel; // LOW, MEDIUM, HIGH
    
    @DecimalMin(value = "0.0", message = "Sensor value must be >= 0")
    @DecimalMax(value = "100.0", message = "Sensor value must be <= 100")
    private Double sensorValue; // Confidence percentage
    
    private String description;
}
