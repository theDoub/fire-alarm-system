package com.firealert.backend.dto;

import java.util.UUID;

import com.firealert.backend.model.enums.DeviceStatus;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * DTO for device response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceResponse {
    
    private UUID id;
    private UUID userId;
    private String name;
    private String location;
    private String serialNum;
    private DeviceStatus status;
    private Boolean isEnable;
    private OffsetDateTime lastSeen;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
