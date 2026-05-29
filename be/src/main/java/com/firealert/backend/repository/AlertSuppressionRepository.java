package com.firealert.backend.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firealert.backend.model.entities.AlertSuppression;

public interface AlertSuppressionRepository extends JpaRepository<AlertSuppression, UUID> {

    Optional<AlertSuppression> findByIdAndDevice_User_Id(UUID id, UUID userId);

    List<AlertSuppression> findByDevice_IdAndIsActiveOrderByCreatedAtDesc(UUID id, Boolean isActive);
    
    List<AlertSuppression> findByDevice_IdOrderByCreatedAtDesc(UUID id);

    Boolean existsByDevice_IdAndIsActiveTrueAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
        UUID id,
        OffsetDateTime startTime,
        OffsetDateTime endTime
    );
    
}
