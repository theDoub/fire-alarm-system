package com.firealert.backend.dto;

import com.firealert.backend.model.enums.AlertLevel;
import com.firealert.backend.model.enums.AlertStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * DTO for alert response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertResponse {
    
    private UUID id;
    private UUID deviceId;
    private UUID infoId;
    private AlertLevel level;
    private String title;
    private String message;
    private AlertStatus status;
    private Integer risk;
    private OffsetDateTime createdAt;
    private OffsetDateTime resolvedAt;
}
