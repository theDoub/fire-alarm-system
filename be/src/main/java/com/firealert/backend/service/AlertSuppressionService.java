package com.firealert.backend.service;

import com.firealert.backend.dto.AlertSuppressionRequest;
import com.firealert.backend.dto.AlertSuppressionResponse;
import com.firealert.backend.model.entities.Alert;
import com.firealert.backend.model.entities.AlertSuppression;
import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.enums.AlertStatus;
import com.firealert.backend.repository.AlertRepository;
import com.firealert.backend.repository.AlertSuppressionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;


@Service
public class AlertSuppressionService {
    private final AlertSuppressionRepository alertSuppressionRepository;
    private final AlertRepository alertRepository;
    private final DeviceService deviceService;
    private final AlertHistoryService alertHistoryService;
    private final NotificationService notificationService;

    public AlertSuppressionService(
        AlertSuppressionRepository alertSuppressionRepository,
        AlertRepository alertRepository,
        DeviceService deviceService,
        AlertHistoryService alertHistoryService,
        NotificationService notificationService
    ){
        this.alertSuppressionRepository = alertSuppressionRepository;
        this.alertRepository = alertRepository;
        this.deviceService = deviceService;
        this.alertHistoryService = alertHistoryService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<AlertSuppressionResponse> getSuppressions(UUID userId, UUID deviceId, Boolean isActive){
        deviceService.getDeviceOwnedByUser(userId, deviceId);

        List<AlertSuppression> suppressions = (isActive == null) 
                ? alertSuppressionRepository.findByDevice_IdOrderByCreatedAtDesc(deviceId)
                : alertSuppressionRepository.findByDevice_IdAndIsActiveOrderByCreatedAtDesc(deviceId, isActive);
        return suppressions.stream().map(this::toResponse).toList();
    }

    @Transactional
    public AlertSuppressionResponse createSuppression(UUID userId, UUID deviceId, AlertSuppressionRequest request){
        Device device = deviceService.getDeviceOwnedByUser(userId, deviceId);

        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().isEqual(request.getStartTime()) || request.getEndTime() == null){
            throw new IllegalArgumentException("End time must be after start time");
        }
        AlertSuppression suppression = new AlertSuppression();
        suppression.setDevice(device);
        suppression.setStartTime(request.getStartTime());
        suppression.setEndTime(request.getEndTime());
        suppression.setIsActive(true);

        AlertSuppression savedSuppression = alertSuppressionRepository.save(suppression);

        suppressActiveAlertsForDevice(
                deviceId,
                "Device alerts suppressed"
        );

        return toResponse(savedSuppression);
    }

    @Transactional
    public AlertSuppressionResponse deactiveSuppression(UUID userId, UUID suppressionId){
        AlertSuppression suppression = alertSuppressionRepository.findByIdAndDevice_User_Id(suppressionId, userId)
                        .orElseThrow(() -> new IllegalArgumentException("Supression not found"));
        if (Boolean.FALSE.equals(suppression.getIsActive())){
            return toResponse(suppression);
        }
        OffsetDateTime now = OffsetDateTime.now();

        suppression.setIsActive(false);
        suppression.setEndTime(now);

        AlertSuppression savedSuppression = alertSuppresionRepository.save(suppression);
        resolveSuppressedAlertsForDevice(
                savedSuppression.getDevice().getId(),
                "Suppression deactivated, suppressed alerts resolved"
        );

        return toResponse(savedSuppression);

    }
    
    @Transactional(readOnly = true)
    public boolean isDeviceSuppressed(UUID deviceId, OffsetDateTime now) {
        return alertSuppressionRepository
                .existsByDevice_IdAndIsActiveTrueAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                        deviceId,
                        now,
                        now
                );
    }

    private AlertSuppressionResponse toResponse(AlertSuppression suppression) {
        return AlertSuppressionResponse.builder()
                .id(suppression.getId())
                .deviceId(suppression.getDevice().getId())
                .startTime(suppression.getStartTime())
                .endTime(suppression.getEndTime())
                .isActive(suppression.getIsActive())
                .createdAt(suppression.getCreatedAt())
                .build();
    }

    private void suppressActiveAlertsForDevice(UUID deviceId, String note) {
        List<Alert> activeAlerts = alertRepository
                .findByDevice_IdAndStatusOrderByCreatedAtDesc(deviceId, AlertStatus.ACTIVE);

        for (Alert alert : activeAlerts) {
            AlertStatus oldStatus = alert.getStatus();

            alert.setStatus(AlertStatus.SUPPRESSED);

            Alert savedAlert = alertRepository.save(alert);

            alertHistoryService.createHistory(
                    savedAlert,
                    oldStatus,
                    AlertStatus.SUPPRESSED,
                    note
            );

            notificationService.createAlertNotification(
                    savedAlert,
                    "Alert suppressed",
                    "Alert for device " + savedAlert.getDevice().getName() + " has been suppressed."
            );
        }
    }

    private void resolveSuppressedAlertsForDevice(UUID deviceId, String note) {
        List<Alert> suppressedAlerts = alertRepository
                .findByDevice_IdAndStatusOrderByCreatedAtDesc(deviceId, AlertStatus.SUPPRESSED);

        OffsetDateTime now = OffsetDateTime.now();

        for (Alert alert : suppressedAlerts) {
            AlertStatus oldStatus = alert.getStatus();

            alert.setStatus(AlertStatus.RESOLVED);
            alert.setResolvedAt(now);

            Alert savedAlert = alertRepository.save(alert);

            alertHistoryService.createHistory(
                    savedAlert,
                    oldStatus,
                    AlertStatus.RESOLVED,
                    note
            );

            notificationService.createAlertNotification(
                    savedAlert,
                    "Alert resolved",
                    "Suppressed alert for device " + savedAlert.getDevice().getName() + " has been resolved."
            );
        }
    }
}
