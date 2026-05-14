package com.firealert.backend.service;

import com.firealert.backend.dto.AlertRequest;
import com.firealert.backend.dto.AlertResponse;
import com.firealert.backend.dto.AlertStatusUpdateRequest;
import com.firealert.backend.model.Alert;
import com.firealert.backend.model.AlertHistory;
import com.firealert.backend.repository.AlertRepository;
import com.firealert.backend.repository.AlertHistoryRepository;
import com.firealert.backend.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Alert management
 * Handles alert creation, status updates, and history tracking
 * Implements alert level evaluation with thresholds and real-time processing
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AlertService {
    
    private final AlertRepository alertRepository;
    private final AlertHistoryRepository alertHistoryRepository;
    private final DeviceRepository deviceRepository;
    
    // Alert level thresholds (confidence/sensor value percentage)
    private static final double LOW_THRESHOLD = 30.0;      // 0-30%
    private static final double MEDIUM_THRESHOLD = 70.0;   // 30-70%
    private static final double HIGH_THRESHOLD = 100.0;    // 70-100%
    
    /**
     * Trigger a new alert with automatic level evaluation
     * Real-time processing: evaluates sensor value and assigns alert level
     */
    public AlertResponse triggerAlert(AlertRequest request) {
        log.info("Triggering alert for device: {} with sensor value: {}", 
                request.getDeviceId(), request.getSensorValue());
        
        // Verify device exists
        if (!deviceRepository.existsById(request.getDeviceId())) {
            log.error("Device not found: {}", request.getDeviceId());
            throw new RuntimeException("Device not found");
        }
        
        // Evaluate alert level based on sensor value
        String evaluatedLevel = request.getAlertLevel();
        if (request.getSensorValue() != null) {
            evaluatedLevel = evaluateAlertLevel(request.getSensorValue());
            log.debug("Alert level evaluated from sensor value {}: {}", 
                    request.getSensorValue(), evaluatedLevel);
        }
        
        // Create alert record
        Alert alert = Alert.builder()
                .deviceId(request.getDeviceId())
                .alertLevel(evaluatedLevel)
                .triggeredAt(LocalDateTime.now())
                .status("ACTIVE")
                .description(request.getDescription())
                .sensorValue(request.getSensorValue())
                .build();
        
        Alert savedAlert = alertRepository.save(alert);
        
        // Create audit trail entry
        saveAlertHistory(savedAlert);
        
        log.info("Alert triggered successfully with ID: {}", savedAlert.getAlertId());
        return mapToResponse(savedAlert);
    }
    
    /**
     * Get all active alerts for a device
     */
    public List<AlertResponse> getActiveAlerts(Integer deviceId) {
        log.debug("Fetching active alerts for device: {}", deviceId);
        
        return alertRepository.findByDeviceIdAndStatus(deviceId, "ACTIVE").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all alerts for a device
     */
    public List<AlertResponse> getDeviceAlerts(Integer deviceId) {
        log.debug("Fetching all alerts for device: {}", deviceId);
        
        return alertRepository.findByDeviceId(deviceId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get alerts within time range
     */
    public List<AlertResponse> getAlertsByTimeRange(Integer deviceId, LocalDateTime startTime, LocalDateTime endTime) {
        log.debug("Fetching alerts for device: {} from {} to {}", deviceId, startTime, endTime);
        
        return alertRepository.findAlertsByDeviceAndTimeRange(deviceId, startTime, endTime).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Clear an active alert
     */
    public AlertResponse clearAlert(Integer alertId) {
        log.info("Clearing alert: {}", alertId);
        
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        if (alert.getStatus().equals("CLEARED")) {
            log.warn("Alert already cleared: {}", alertId);
            throw new RuntimeException("Alert already cleared");
        }
        
        alert.setStatus("CLEARED");
        alert.setClearedAt(LocalDateTime.now());
        Alert updatedAlert = alertRepository.save(alert);
        
        // Update history
        saveAlertHistory(updatedAlert);
        
        log.info("Alert cleared successfully: {}", alertId);
        return mapToResponse(updatedAlert);
    }
    
    /**
     * Disable alert temporarily
     */
    public AlertResponse disableAlert(Integer alertId) {
        log.info("Disabling alert: {}", alertId);
        
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        alert.setStatus("DISABLED");
        Alert updatedAlert = alertRepository.save(alert);
        
        // Update history
        saveAlertHistory(updatedAlert);
        
        log.info("Alert disabled successfully: {}", alertId);
        return mapToResponse(updatedAlert);
    }
    
    /**
     * Update alert status
     */
    public AlertResponse updateAlertStatus(Integer alertId, AlertStatusUpdateRequest request) {
        log.info("Updating alert: {} to status: {}", alertId, request.getStatus());
        
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        String newStatus = request.getStatus();
        
        // Validate status
        if (!isValidStatus(newStatus)) {
            log.error("Invalid alert status: {}", newStatus);
            throw new RuntimeException("Invalid alert status");
        }
        
        alert.setStatus(newStatus);
        
        if (newStatus.equals("CLEARED")) {
            alert.setClearedAt(LocalDateTime.now());
        }
        
        Alert updatedAlert = alertRepository.save(alert);
        saveAlertHistory(updatedAlert);
        
        log.info("Alert status updated successfully: {}", alertId);
        return mapToResponse(updatedAlert);
    }
    
    /**
     * Get alert history for device
     */
    public List<AlertResponse> getAlertHistory(Integer deviceId) {
        log.debug("Fetching alert history for device: {}", deviceId);
        
        return alertHistoryRepository.findByDeviceIdOrderByCreatedAtDesc(deviceId).stream()
                .map(h -> AlertResponse.builder()
                        .alertId(h.getAlertId())
                        .deviceId(h.getDeviceId())
                        .alertLevel(h.getAlertLevel())
                        .triggeredAt(h.getTriggeredAt())
                        .clearedAt(h.getClearedAt())
                        .status(h.getStatus())
                        .description(h.getDescription())
                        .sensorValue(h.getSensorValue())
                        .createdAt(h.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * Evaluate alert level based on sensor value (confidence percentage)
     * LOW: 0-30%
     * MEDIUM: 30-70%
     * HIGH: 70-100%
     */
    private String evaluateAlertLevel(Double sensorValue) {
        if (sensorValue == null) {
            return "LOW";
        }
        
        if (sensorValue >= HIGH_THRESHOLD) {
            return "HIGH";
        } else if (sensorValue >= MEDIUM_THRESHOLD) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }
    
    /**
     * Validate alert status
     */
    private boolean isValidStatus(String status) {
        return status.equals("ACTIVE") || status.equals("CLEARED") || status.equals("DISABLED");
    }
    
    /**
     * Save alert history for audit trail
     */
    private void saveAlertHistory(Alert alert) {
        AlertHistory history = AlertHistory.builder()
                .alertId(alert.getAlertId())
                .deviceId(alert.getDeviceId())
                .alertLevel(alert.getAlertLevel())
                .triggeredAt(alert.getTriggeredAt())
                .clearedAt(alert.getClearedAt())
                .status(alert.getStatus())
                .description(alert.getDescription())
                .sensorValue(alert.getSensorValue())
                .build();
        
        alertHistoryRepository.save(history);
        log.debug("Alert history saved for alert: {}", alert.getAlertId());
    }
    
    /**
     * Map Alert entity to AlertResponse DTO
     */
    private AlertResponse mapToResponse(Alert alert) {
        return AlertResponse.builder()
                .alertId(alert.getAlertId())
                .deviceId(alert.getDeviceId())
                .alertLevel(alert.getAlertLevel())
                .triggeredAt(alert.getTriggeredAt())
                .clearedAt(alert.getClearedAt())
                .status(alert.getStatus())
                .description(alert.getDescription())
                .sensorValue(alert.getSensorValue())
                .createdAt(alert.getCreatedAt())
                .updatedAt(alert.getUpdatedAt())
                .build();
    }
}
