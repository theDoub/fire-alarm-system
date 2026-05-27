package com.firealert.backend.controller;

import com.firealert.backend.dto.AlertHistoryResponse;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.service.AlertHistoryService;
import com.firealert.backend.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/alerts/{alertId}/histories")
public class AlertHistoryController {

    private final AlertService alertService;
    private final AlertHistoryService alertHistoryService;

    public AlertHistoryController(
            AlertService alertService,
            AlertHistoryService alertHistoryService
    ) {
        this.alertService = alertService;
        this.alertHistoryService = alertHistoryService;
    }

    @GetMapping
    public ResponseEntity<List<AlertHistoryResponse>> getAlertHistories(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID alertId
    ) {
        alertService.getAlertOwnedByUser(currentUser.getId(), alertId);

        return ResponseEntity.ok(
                alertHistoryService.getHistories(alertId)
        );
    }
}