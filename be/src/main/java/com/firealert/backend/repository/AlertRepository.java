package com.firealert.backend.repository;

import com.firealert.backend.model.entities.Alert;
import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.enums.AlertLevel;
import com.firealert.backend.model.enums.AlertStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.lang.ProcessHandle.Info;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Alert entity
 * Provides CRUD operations and custom queries for alert management
 */
@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {

    Optional<Alert> findByIdAndDevice_User_Id(UUID alertId, UUID userId);
    
    /**
     * Find all alerts for a specific device
     */
    List<Alert> findByDevice_IdOrderByCreatedAtDesc(UUID deviceId);

    /**
     * Find Alerts between a specific period
     */
    List<Alert> findByDevice_IdAndCreatedAtBetweenOrderByCreatedAtDesc(
            UUID deviceId,
            OffsetDateTime startTime,
            OffsetDateTime endTime
    );
    
    /**
     * Find active alerts for a device
     */
    List<Alert> findByDevice_IdAndStatusOrderByCreatedAtDesc(UUID deviceId, String status);

    /**
     * Find info matchs with alert
     */
    Optional<Alert> findByInfo_Id(UUID infoId);

    /**
     * Find all alerts for a specific device
     */
    List<Alert> findByDevice_IdAndLevelOrderByCreatedAtDesc(UUID deviceId, AlertLevel alertLevel);

    /**
     * Count number of alert with status on a device
     */
    long countByDevice_IdAndStatus(UUID deviceId, AlertStatus status);

    long countByDevice_IdAndLevel(UUID deviceId, AlertLevel alertLevel);

}
