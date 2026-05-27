package com.firealert.backend.controller;

import com.firealert.backend.dto.AlertCreateRequest;
import com.firealert.backend.dto.AlertResponse;
import com.firealert.backend.dto.AlertStatusUpdateRequest;
import com.firealert.backend.model.enums.AlertLevel;
import com.firealert.backend.model.enums.AlertStatus;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/devices/{deviceId}/alerts")
    public ResponseEntity<List<AlertResponse>> getAlertsByDevice(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId,
            @RequestParam(required = false) AlertStatus status,
            @RequestParam(required = false) AlertLevel level
    ) {
        return ResponseEntity.ok(
                alertService.getAlertsByDevice(
                        currentUser.getId(),
                        deviceId,
                        status,
                        level
                )
        );
    }

    @PostMapping("/devices/{deviceId}/alerts")
    public ResponseEntity<AlertResponse> createAlert(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId,
            @Valid @RequestBody AlertCreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                alertService.createAlert(
                        currentUser.getId(),
                        deviceId,
                        request
                )
        );
    }

    @GetMapping("/alerts/{alertId}")
    public ResponseEntity<AlertResponse> getAlertDetail(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID alertId
    ) {
        return ResponseEntity.ok(
                alertService.getAlertDetail(currentUser.getId(), alertId)
        );
    }

    @PatchMapping("/alerts/{alertId}/status")
    public ResponseEntity<AlertResponse> updateAlertStatus(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID alertId,
            @Valid @RequestBody AlertStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(
                alertService.updateStatus(
                        currentUser.getId(),
                        alertId,
                        request
                )
        );
    }
}