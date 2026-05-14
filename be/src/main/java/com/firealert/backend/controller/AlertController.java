package com.firealert.backend.controller;

import com.firealert.backend.dto.*;
import com.firealert.backend.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for Alert management
 * Endpoints for alert creation, status updates, and history retrieval
 * Supports real-time alert processing with threshold evaluation
 */
@RestController
@RequestMapping("/alerts")
@RequiredArgsConstructor
@Slf4j
public class AlertController {
    
    private final AlertService alertService;
    
    /**
     * Trigger a new alert
     * POST /api/alerts
     * Real-time processing: evaluates sensor value and assigns alert level
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AlertResponse>> triggerAlert(
            @Valid @RequestBody AlertRequest request) {
        log.info("Triggering alert for device: {}", request.getDeviceId());
        
        try {
            AlertResponse response = alertService.triggerAlert(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Alert triggered successfully", response, 201));
        } catch (Exception e) {
            log.error("Error triggering alert: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }
    
    /**
     * Get active alerts for device
     * GET /api/alerts/active?deviceId={deviceId}
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getActiveAlerts(
            @RequestParam Integer deviceId) {
        log.info("Fetching active alerts for device: {}", deviceId);
        
        try {
            List<AlertResponse> alerts = alertService.getActiveAlerts(deviceId);
            return ResponseEntity.ok(ApiResponse.success("Active alerts retrieved successfully", alerts, 200));
        } catch (Exception e) {
            log.error("Error fetching active alerts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), 500));
        }
    }
    
    /**
     * Get all alerts for device
     * GET /api/alerts?deviceId={deviceId}
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getDeviceAlerts(
            @RequestParam Integer deviceId) {
        log.info("Fetching all alerts for device: {}", deviceId);
        
        try {
            List<AlertResponse> alerts = alertService.getDeviceAlerts(deviceId);
            return ResponseEntity.ok(ApiResponse.success("Alerts retrieved successfully", alerts, 200));
        } catch (Exception e) {
            log.error("Error fetching alerts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), 500));
        }
    }
    
    /**
     * Get alerts by time range
     * GET /api/alerts/history?deviceId={deviceId}&startTime={startTime}&endTime={endTime}
     * Date format: yyyy-MM-dd'T'HH:mm:ss
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlertsByTimeRange(
            @RequestParam Integer deviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        log.info("Fetching alerts for device: {} from {} to {}", deviceId, startTime, endTime);
        
        try {
            List<AlertResponse> alerts = alertService.getAlertsByTimeRange(deviceId, startTime, endTime);
            return ResponseEntity.ok(ApiResponse.success("Alert history retrieved successfully", alerts, 200));
        } catch (Exception e) {
            log.error("Error fetching alert history: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), 500));
        }
    }
    
    /**
     * Get complete alert history for device
     * GET /api/alerts/device-history?deviceId={deviceId}
     */
    @GetMapping("/device-history")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlertHistory(
            @RequestParam Integer deviceId) {
        log.info("Fetching alert history for device: {}", deviceId);
        
        try {
            List<AlertResponse> history = alertService.getAlertHistory(deviceId);
            return ResponseEntity.ok(ApiResponse.success("Alert history retrieved successfully", history, 200));
        } catch (Exception e) {
            log.error("Error fetching alert history: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), 500));
        }
    }
    
    /**
     * Clear alert (resolve active alert)
     * PUT /api/alerts/{alertId}/clear
     */
    @PutMapping("/{alertId}/clear")
    public ResponseEntity<ApiResponse<AlertResponse>> clearAlert(@PathVariable Integer alertId) {
        log.info("Clearing alert: {}", alertId);
        
        try {
            AlertResponse response = alertService.clearAlert(alertId);
            return ResponseEntity.ok(ApiResponse.success("Alert cleared successfully", response, 200));
        } catch (Exception e) {
            log.error("Error clearing alert: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }
    
    /**
     * Disable alert temporarily
     * PUT /api/alerts/{alertId}/disable
     */
    @PutMapping("/{alertId}/disable")
    public ResponseEntity<ApiResponse<AlertResponse>> disableAlert(@PathVariable Integer alertId) {
        log.info("Disabling alert: {}", alertId);
        
        try {
            AlertResponse response = alertService.disableAlert(alertId);
            return ResponseEntity.ok(ApiResponse.success("Alert disabled successfully", response, 200));
        } catch (Exception e) {
            log.error("Error disabling alert: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }
    
    /**
     * Update alert status
     * PUT /api/alerts/{alertId}/status
     */
    @PutMapping("/{alertId}/status")
    public ResponseEntity<ApiResponse<AlertResponse>> updateAlertStatus(
            @PathVariable Integer alertId,
            @Valid @RequestBody AlertStatusUpdateRequest request) {
        log.info("Updating alert: {} status to: {}", alertId, request.getStatus());
        
        try {
            AlertResponse response = alertService.updateAlertStatus(alertId, request);
            return ResponseEntity.ok(ApiResponse.success("Alert status updated successfully", response, 200));
        } catch (Exception e) {
            log.error("Error updating alert status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/alerts/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Alert service is healthy", "OK", 200));
    }
}
