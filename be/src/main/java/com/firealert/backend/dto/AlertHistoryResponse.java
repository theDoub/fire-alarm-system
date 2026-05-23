package com.firealert.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.firealert.backend.model.enums.AlertStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertHistoryResponse {
    private UUID id;
    private UUID alertId;
    private AlertStatus oldStatus;
    private AlertStatus newStatus;
    private String note;
    private OffsetDateTime createdAt;
}
