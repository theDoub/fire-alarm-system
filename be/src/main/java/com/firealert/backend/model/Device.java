package com.firealert.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Device Entity - Represents a physical fire/smoke detection device.
 * Each device belongs to a user and can trigger multiple alerts.
 */
@Entity
@Table(name = "devices", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Integer deviceId;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "device_name", nullable = false, length = 255)
    private String deviceName;
    
    @Column(name = "status", nullable = false, length = 50)
    private String status; // ACTIVE, INACTIVE, MAINTENANCE
    
    @Column(name = "is_enabled", nullable = false)
    private Boolean isEnabled;
    
    @Column(name = "last_heartbeat")
    private LocalDateTime lastHeartbeat;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isEnabled == null) {
            isEnabled = true;
        }
        if (status == null) {
            status = "ACTIVE";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
