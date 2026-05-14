package com.firealert.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Alert Entity - Represents a fire/smoke detection alert.
 * Supports 3 alert levels: LOW, MEDIUM, HIGH
 * Tracks alert status: ACTIVE, CLEARED, DISABLED
 */
@Entity
@Table(name = "alerts", indexes = {
    @Index(name = "idx_device_id", columnList = "device_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_alert_level", columnList = "alert_level"),
    @Index(name = "idx_triggered_at", columnList = "triggered_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alert_id")
    private Integer alertId;
    
    @Column(name = "device_id", nullable = false)
    private Integer deviceId;
    
    @Column(name = "alert_level", nullable = false, length = 50)
    private String alertLevel; // LOW, MEDIUM, HIGH
    
    @Column(name = "triggered_at", nullable = false)
    private LocalDateTime triggeredAt;
    
    @Column(name = "cleared_at")
    private LocalDateTime clearedAt;
    
    @Column(name = "status", nullable = false, length = 50)
    private String status; // ACTIVE, CLEARED, DISABLED
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "sensor_value")
    private Double sensorValue; // Confidence percentage or sensor reading
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
