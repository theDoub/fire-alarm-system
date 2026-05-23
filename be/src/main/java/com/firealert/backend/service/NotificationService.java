package com.firealert.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firealert.backend.dto.NotificationResponse;
import com.firealert.backend.model.entities.Alert;
import com.firealert.backend.model.entities.Notification;
import com.firealert.backend.model.entities.User;
import com.firealert.backend.model.enums.NotificationType;
import com.firealert.backend.repository.NotificationRepository;
import com.firealert.backend.repository.UserRepository;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository){
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(UUID userId, Boolean isRead, NotificationType type){
        List<Notification> notifications;
        if (isRead != null) {
            notifications = notificationRepository.findByUser_IdAndIsReadOrderByCreatedAtDesc(userId, isRead);
        } else if (type != null){
            notifications = notificationRepository.findByUser_IdAndTypeOrderByCreatedAtDesc(userId, type);
        } else {
            notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        }
        return notifications.stream().map(this::toResponse).toList();
    }

    @Transactional
    public NotificationResponse markAsRead(UUID userId, UUID notiId){
        Notification notification = notificationRepository.findByIdAndUser_Id(notiId, userId)
                                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public Notification createNotification(UUID userId, String title, String message, NotificationType type){
        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException(message));
        return createNotification(user, null, title, message, type);
    }

    @Transactional
    public Notification createAlertNotification(Alert alert, String title, String message){
        User user = alert.getDevice().getUser();
        return createNotification(user, alert, title, message, NotificationType.ALERT);
    }

    private Notification createNotification(User user, Alert alert, String title, String message, NotificationType type){
        Notification noti = new Notification();
        noti.setUser(user);
        noti.setAlert(alert);
        noti.setTitle(title);
        noti.setMessage(message);
        noti.setType(type);
        noti.setIsRead(false);
        return notificationRepository.save(noti);
    }

    private NotificationResponse toResponse(Notification notification){
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .alertId(notification.getAlert() != null ? notification.getAlert().getId() : null)
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
