package com.firealert.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

import com.firealert.backend.model.enums.AlertLevel;

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
public class AlertCreateRequest {
    
    @NotNull(message = "Info ID is required")
    private UUID infoId;

    @NotNull(message = "Alert level is required")
    private AlertLevel level;

    @NotBlank(message =  "Title is required")
    @Size(max = 255, message = "255 letters only")
    private String title;

    private String message;

    @Min(value = 0, message = "Risk must be >= 0")
    @Max(value = 100, message = "Risk must be <= 100")
    private Integer risk;
}
