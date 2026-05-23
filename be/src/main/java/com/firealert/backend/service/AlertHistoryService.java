package com.firealert.backend.service;

import com.firealert.backend.dto.AlertHistoryResponse;
import com.firealert.backend.model.entities.Alert;
import com.firealert.backend.model.entities.AlertHistory;
import com.firealert.backend.model.enums.AlertStatus;
import com.firealert.backend.repository.AlertHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AlertHistoryService {
    private final AlertHistoryRepository alertHistoryRepository;

    public AlertHistoryService(AlertHistoryRepository alertHistoryRepository) {
        this.alertHistoryRepository = alertHistoryRepository;
    }

    @Transactional(readOnly = true)
    public List<AlertHistoryResponse> getHistories(UUID alertId) {
        return alertHistoryRepository.findByAlert_IdOrderByCreatedAtDesc(alertId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AlertHistory createHistory(
            Alert alert,
            AlertStatus oldStatus,
            AlertStatus newStatus,
            String note
    ) {
        AlertHistory history = new AlertHistory();
        history.setAlert(alert);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setNote(note);
        history.setCreatedAt(OffsetDateTime.now());

        return alertHistoryRepository.save(history);
    }

    private AlertHistoryResponse toResponse(AlertHistory history) {
        return AlertHistoryResponse.builder()
                .id(history.getId())
                .alertId(history.getAlert().getId())
                .oldStatus(history.getOldStatus())
                .newStatus(history.getNewStatus())
                .note(history.getNote())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
