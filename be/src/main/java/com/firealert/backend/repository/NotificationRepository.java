package com.firealert.backend.repository;

import com.firealert.backend.model.entities.Notification;
import com.firealert.backend.model.enums.NotificationType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    Optional<Notification> findByIdAndUser_Id(UUID notificationId, UUID userId);
    
    List<Notification> findByUser_IdOrderByCreatedAtDesc(UUID id);

    List<Notification> findByUser_IdAndIsReadOrderByCreatedAtDesc(UUID id, boolean isRead);

    List<Notification> findByUser_IdAndTypeOrderByCreatedAtDesc(UUID id, NotificationType type);

    List<Notification> findByUser_IdAndAlert_IdOrderByCreatedAtDesc(UUID userId, UUID alertId);
}
