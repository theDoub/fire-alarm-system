package com.firealert.backend.service;

import com.firealert.backend.dto.AlertRequest;
import com.firealert.backend.model.Alert;
import com.firealert.backend.repository.AlertRepository;
import com.firealert.backend.repository.AlertHistoryRepository;
import com.firealert.backend.repository.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

/**
 * Unit tests for AlertService
 */
@ExtendWith(MockitoExtension.class)
public class AlertServiceTest {
    
    @Mock
    private AlertRepository alertRepository;
    
    @Mock
    private AlertHistoryRepository alertHistoryRepository;
    
    @Mock
    private DeviceRepository deviceRepository;
    
    @InjectMocks
    private AlertService alertService;
    
    private AlertRequest alertRequest;
    private Alert mockAlert;
    
    @BeforeEach
    void setUp() {
        alertRequest = AlertRequest.builder()
                .deviceId(1)
                .alertLevel("HIGH")
                .sensorValue(85.0)
                .description("High smoke detected")
                .build();
        
        mockAlert = Alert.builder()
                .alertId(1)
                .deviceId(1)
                .alertLevel("HIGH")
                .triggeredAt(LocalDateTime.now())
                .status("ACTIVE")
                .description("High smoke detected")
                .sensorValue(85.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    @Test
    void testTriggerAlert_Success() {
        when(deviceRepository.existsById(anyInt())).thenReturn(true);
        when(alertRepository.save(any(Alert.class))).thenReturn(mockAlert);
        when(alertHistoryRepository.save(any())).thenReturn(null);
        
        assertDoesNotThrow(() -> alertService.triggerAlert(alertRequest));
    }
    
    @Test
    void testTriggerAlert_DeviceNotFound() {
        when(deviceRepository.existsById(anyInt())).thenReturn(false);
        
        assertThrows(RuntimeException.class, () -> alertService.triggerAlert(alertRequest));
    }
    
    @Test
    void testClearAlert_Success() {
        when(alertRepository.findById(1)).thenReturn(Optional.of(mockAlert));
        when(alertRepository.save(any(Alert.class))).thenReturn(mockAlert);
        when(alertHistoryRepository.save(any())).thenReturn(null);
        
        assertDoesNotThrow(() -> alertService.clearAlert(1));
    }
    
    @Test
    void testClearAlert_AlertNotFound() {
        when(alertRepository.findById(999)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> alertService.clearAlert(999));
    }
    
    @Test
    void testAlertLevelEvaluation_Low() {
        alertRequest.setSensorValue(25.0);
        when(deviceRepository.existsById(anyInt())).thenReturn(true);
        
        Alert lowAlert = mockAlert;
        lowAlert.setAlertLevel("LOW");
        lowAlert.setSensorValue(25.0);
        
        when(alertRepository.save(any(Alert.class))).thenReturn(lowAlert);
        when(alertHistoryRepository.save(any())).thenReturn(null);
        
        assertDoesNotThrow(() -> alertService.triggerAlert(alertRequest));
    }
    
    @Test
    void testAlertLevelEvaluation_Medium() {
        alertRequest.setSensorValue(50.0);
        when(deviceRepository.existsById(anyInt())).thenReturn(true);
        
        Alert mediumAlert = mockAlert;
        mediumAlert.setAlertLevel("MEDIUM");
        mediumAlert.setSensorValue(50.0);
        
        when(alertRepository.save(any(Alert.class))).thenReturn(mediumAlert);
        when(alertHistoryRepository.save(any())).thenReturn(null);
        
        assertDoesNotThrow(() -> alertService.triggerAlert(alertRequest));
    }
}
