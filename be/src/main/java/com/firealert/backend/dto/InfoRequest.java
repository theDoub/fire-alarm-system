package com.firealert.backend.dto;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfoRequest {
    
    private Double temperature;
    private Double smoke;
    private Double gas;
    private Double flame;
    private Double sound;
    private Double light;
    private OffsetDateTime recordedAt;
}
