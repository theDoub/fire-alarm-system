package com.firealert.backend.dto;

import java.time.OffsetDateTime;

import com.firealert.backend.model.enums.NotificationType;

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
public class NotificationResponse {
    
    private UUID id;
    private UUID userId;
    private UUID alertId;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private OffsetDateTime createdAt;
}
