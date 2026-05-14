package com.firealert.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * AlertHistory Entity - Complete audit trail of all alerts.
 * Maintains historical data for reporting and analysis.
 */
@Entity
@Table(name = "alert_history", indexes = {
    @Index(name = "idx_device_id_hist", columnList = "device_id"),
    @Index(name = "idx_alert_id_hist", columnList = "alert_id"),
    @Index(name = "idx_created_at_hist", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Integer historyId;
    
    @Column(name = "alert_id", nullable = false)
    private Integer alertId;
    
    @Column(name = "device_id", nullable = false)
    private Integer deviceId;
    
    @Column(name = "alert_level", nullable = false, length = 50)
    private String alertLevel;
    
    @Column(name = "triggered_at", nullable = false)
    private LocalDateTime triggeredAt;
    
    @Column(name = "cleared_at")
    private LocalDateTime clearedAt;
    
    @Column(name = "status", nullable = false, length = 50)
    private String status;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "sensor_value")
    private Double sensorValue;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
