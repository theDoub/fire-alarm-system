package com.firealert.backend.repository;

import com.firealert.backend.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Alert entity
 * Provides CRUD operations and custom queries for alert management
 */
@Repository
public interface AlertRepository extends JpaRepository<Alert, Integer> {
    
    /**
     * Find all alerts for a specific device
     */
    List<Alert> findByDeviceId(Integer deviceId);
    
    /**
     * Find active alerts for a device
     */
    List<Alert> findByDeviceIdAndStatus(Integer deviceId, String status);
    
    /**
     * Find alerts within time range
     */
    @Query("SELECT a FROM Alert a WHERE a.deviceId = :deviceId AND a.triggeredAt BETWEEN :startTime AND :endTime ORDER BY a.triggeredAt DESC")
    List<Alert> findAlertsByDeviceAndTimeRange(
            @Param("deviceId") Integer deviceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
    
    /**
     * Find recent active alerts
     */
    @Query(value = "SELECT * FROM alerts WHERE status = :status ORDER BY triggered_at DESC LIMIT 50", nativeQuery = true)
    List<Alert> findRecentAlerts(@Param("status") String status);
    
    /**
     * Count active alerts for a device
     */
    long countByDeviceIdAndStatus(Integer deviceId, String status);
}
