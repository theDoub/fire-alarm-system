package com.firealert.backend.controller;

import com.firealert.backend.dto.NotificationResponse;
import com.firealert.backend.model.enums.NotificationType;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) NotificationType type
    ) {
        return ResponseEntity.ok(
                notificationService.getMyNotifications(
                        currentUser.getId(),
                        isRead,
                        type
                )
        );
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID notificationId
    ) {
        return ResponseEntity.ok(
                notificationService.markAsRead(
                        currentUser.getId(),
                        notificationId
                )
        );
    }
}