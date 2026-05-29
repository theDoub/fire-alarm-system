package com.firealert.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertSuppressionResponse {
    
    private UUID id;
    private UUID deviceId;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private Boolean isActive;
    private OffsetDateTime createdAt;
}
