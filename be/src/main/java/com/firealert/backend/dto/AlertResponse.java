package com.firealert.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for alert response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertResponse {
    
    private Integer alertId;
    private Integer deviceId;
    private String alertLevel;
    private LocalDateTime triggeredAt;
    private LocalDateTime clearedAt;
    private String status;
    private String description;
    private Double sensorValue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
