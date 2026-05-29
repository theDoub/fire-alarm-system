package com.firealert.backend.dto;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfoResponse {
    
    private UUID id;
    private UUID deviceId;
    private Double temperature;
    private Double smoke;
    private Double gas;
    private Double flame;
    private Double sound;
    private Double light;
    private OffsetDateTime recordedAt;
}
