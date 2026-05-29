package com.firealert.backend.repository;

import com.firealert.backend.model.entities.AlertHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

/**
 * Repository for AlertHistory entity
 * Provides queries for alert history audit trail
 */
@Repository
public interface AlertHistoryRepository extends JpaRepository<AlertHistory, UUID> {
    
    /**
     * Find all alert history for a device
     */
    List<AlertHistory> findByAlert_IdOrderByCreatedAtDesc(UUID alertId);
}
