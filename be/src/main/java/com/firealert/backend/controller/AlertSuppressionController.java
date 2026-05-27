package com.firealert.backend.controller;

import com.firealert.backend.dto.AlertSuppressionRequest;
import com.firealert.backend.dto.AlertSuppressionResponse;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.service.AlertSuppressionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class AlertSuppressionController {

    private final AlertSuppressionService alertSuppressionService;

    public AlertSuppressionController(AlertSuppressionService alertSuppressionService) {
        this.alertSuppressionService = alertSuppressionService;
    }

    @GetMapping("/devices/{deviceId}/suppressions")
    public ResponseEntity<List<AlertSuppressionResponse>> getSuppressions(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId,
            @RequestParam(required = false) Boolean isActive
    ) {
        return ResponseEntity.ok(
                alertSuppressionService.getSuppressions(
                        currentUser.getId(),
                        deviceId,
                        isActive
                )
        );
    }

    @PostMapping("/devices/{deviceId}/suppressions")
    public ResponseEntity<AlertSuppressionResponse> createSuppression(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId,
            @Valid @RequestBody AlertSuppressionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                alertSuppressionService.createSuppression(
                        currentUser.getId(),
                        deviceId,
                        request
                )
        );
    }

    @PatchMapping("/suppressions/{suppressionId}/deactivate")
    public ResponseEntity<AlertSuppressionResponse> deactivateSuppression(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID suppressionId
    ) {
        return ResponseEntity.ok(
                alertSuppressionService.deactiveSuppression(
                        currentUser.getId(),
                        suppressionId
                )
        );
    }
}