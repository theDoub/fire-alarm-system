package com.firealert.backend.service;

import com.firealert.backend.dto.AlertCreateRequest;
import com.firealert.backend.dto.AlertResponse;
import com.firealert.backend.dto.AlertStatusUpdateRequest;
import com.firealert.backend.model.entities.Alert;
import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.entities.Info;
import com.firealert.backend.model.enums.AlertLevel;
import com.firealert.backend.model.enums.AlertStatus;
import com.firealert.backend.repository.AlertRepository;
import com.firealert.backend.repository.AlertSuppressionRepository;
import com.firealert.backend.repository.InfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
/**
 * Service for Alert management
 * Handles alert creation, status updates, and history tracking
 * Implements alert level evaluation with thresholds and real-time processing
 */
@Service
public class AlertService {
    
    private final AlertRepository alertRepository;
    private final InfoRepository infoRepository;
    private final DeviceService deviceService;
    private final AlertSuppressionRepository alertSuppressionRepository;
    private final AlertHistoryService alertHistoryService;
    private final NotificationService notificationService;

    public AlertService(
            AlertRepository alertRepository,
            InfoRepository infoRepository,
            DeviceService deviceService,
            AlertSuppressionRepository alertSuppressionRepository,
            AlertHistoryService alertHistoryService,
            NotificationService notificationService
    ) {
        this.alertRepository = alertRepository;
        this.infoRepository = infoRepository;
        this.deviceService = deviceService;
        this.alertSuppressionRepository = alertSuppressionRepository;
        this.alertHistoryService = alertHistoryService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsByDevice(
            UUID userId,
            UUID deviceId,
            AlertStatus status,
            AlertLevel level
    ) {
        deviceService.getDeviceOwnedByUser(userId, deviceId);

        List<Alert> alerts;

        if (status != null) {
            alerts = alertRepository.findByDevice_IdAndStatusOrderByCreatedAtDesc(deviceId, status);
        } else if (level != null) {
            alerts = alertRepository.findByDevice_IdAndLevelOrderByCreatedAtDesc(deviceId, level);
        } else {
            alerts = alertRepository.findByDevice_IdOrderByCreatedAtDesc(deviceId);
        }

        return alerts.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AlertResponse getAlertDetail(UUID userId, UUID alertId) {
        return toResponse(getAlertOwnedByUser(userId, alertId));
    }

    @Transactional
    public AlertResponse createAlert(UUID userId, UUID deviceId, AlertCreateRequest request) {
        Device device = deviceService.getDeviceOwnedByUser(userId, deviceId);

        Info info = infoRepository.findById(request.getInfoId())
                .filter(existingInfo -> existingInfo.getDevice().getId().equals(deviceId))
                .orElseThrow(() -> new IllegalArgumentException("Info not found"));

        if (alertRepository.existsByInfo_Id(info.getId())) {
            throw new IllegalArgumentException("This info already has an alert");
        }

        OffsetDateTime now = OffsetDateTime.now();

        boolean suppressed = alertSuppressionRepository
                .existsByDevice_IdAndIsActiveTrueAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                        deviceId,
                        now,
                        now
                );

        if (suppressed) {
            throw new IllegalStateException("Device is currently suppressed. Alert will not be created.");
        }

        Alert alert = new Alert();
        alert.setDevice(device);
        alert.setInfo(info);
        alert.setLevel(request.getLevel());
        alert.setTitle(request.getTitle().trim());
        alert.setMessage(request.getMessage());
        alert.setRisk(request.getRisk());
        alert.setStatus(AlertStatus.ACTIVE);
        alert.setCreatedAt(now);

        Alert savedAlert = alertRepository.save(alert);

        alertHistoryService.createHistory(
                savedAlert,
                AlertStatus.ACTIVE,
                AlertStatus.ACTIVE,
                "Alert created from sensor info"
        );

        notificationService.createAlertNotification(
                savedAlert,
                savedAlert.getTitle(),
                savedAlert.getMessage()
        );

        return toResponse(savedAlert);
    }

     @Transactional
    public AlertResponse updateStatus(
            UUID userId,
            UUID alertId,
            AlertStatusUpdateRequest request
    ) {
        Alert alert = getAlertOwnedByUser(userId, alertId);

        AlertStatus oldStatus = alert.getStatus();
        AlertStatus newStatus = request.getStatus();

        if (oldStatus == newStatus) {
            return toResponse(alert);
        }

        alert.setStatus(newStatus);

        if (newStatus == AlertStatus.RESOLVED || newStatus == AlertStatus.DISMISSED) {
            alert.setResolvedAt(OffsetDateTime.now());
        } else {
            alert.setResolvedAt(null);
        }

        Alert savedAlert = alertRepository.save(alert);

        alertHistoryService.createHistory(
                savedAlert,
                oldStatus,
                newStatus,
                request.getNote()
        );

        notificationService.createAlertNotification(
                savedAlert,
                "Alert status updated",
                "Alert " + savedAlert.getTitle() + " changed from " + oldStatus + " to " + newStatus
        );

        return toResponse(savedAlert);
    }

    @Transactional(readOnly = true)
    public Alert getAlertOwnedByUser(UUID userId, UUID alertId) {
        return alertRepository.findByIdAndDevice_User_Id(alertId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));
    }

    private AlertResponse toResponse(Alert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .deviceId(alert.getDevice().getId())
                .infoId(alert.getInfo().getId())
                .level(alert.getLevel())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .status(alert.getStatus())
                .risk(alert.getRisk())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}
