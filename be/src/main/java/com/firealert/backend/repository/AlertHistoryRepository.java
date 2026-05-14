package com.firealert.backend.repository;

import com.firealert.backend.model.AlertHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for AlertHistory entity
 * Provides queries for alert history audit trail
 */
@Repository
public interface AlertHistoryRepository extends JpaRepository<AlertHistory, Integer> {
    
    /**
     * Find all alert history for a device
     */
    List<AlertHistory> findByDeviceIdOrderByCreatedAtDesc(Integer deviceId);
    
    /**
     * Find history within time range
     */
    @Query("SELECT h FROM AlertHistory h WHERE h.deviceId = :deviceId AND h.createdAt BETWEEN :startTime AND :endTime ORDER BY h.createdAt DESC")
    List<AlertHistory> findHistoryByDeviceAndTimeRange(
            @Param("deviceId") Integer deviceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
    
    /**
     * Find history for specific alert
     */
    List<AlertHistory> findByAlertIdOrderByCreatedAtDesc(Integer alertId);
}
