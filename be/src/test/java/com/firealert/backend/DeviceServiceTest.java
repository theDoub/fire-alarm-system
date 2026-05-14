package com.firealert.backend.service;

import com.firealert.backend.dto.DeviceRequest;
import com.firealert.backend.model.Device;
import com.firealert.backend.repository.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Unit tests for DeviceService
 */
@ExtendWith(MockitoExtension.class)
public class DeviceServiceTest {
    
    @Mock
    private DeviceRepository deviceRepository;
    
    @InjectMocks
    private DeviceService deviceService;
    
    private DeviceRequest deviceRequest;
    private Device mockDevice;
    
    @BeforeEach
    void setUp() {
        deviceRequest = DeviceRequest.builder()
                .deviceName("Living Room Detector")
                .build();
        
        mockDevice = Device.builder()
                .deviceId(1)
                .userId(1)
                .deviceName("Living Room Detector")
                .status("ACTIVE")
                .isEnabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    @Test
    void testCreateDevice_Success() {
        when(deviceRepository.save(any(Device.class))).thenReturn(mockDevice);
        
        assertDoesNotThrow(() -> deviceService.createDevice(1, deviceRequest));
    }
    
    @Test
    void testGetUserDevices_Success() {
        List<Device> devices = Arrays.asList(mockDevice);
        when(deviceRepository.findByUserId(1)).thenReturn(devices);
        
        var result = deviceService.getUserDevices(1);
        assertNotNull(result);
        assertEquals(1, result.size());
    }
    
    @Test
    void testGetUserDevices_Empty() {
        when(deviceRepository.findByUserId(1)).thenReturn(Arrays.asList());
        
        var result = deviceService.getUserDevices(1);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
