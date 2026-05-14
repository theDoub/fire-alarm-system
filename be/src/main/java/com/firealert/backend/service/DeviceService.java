package com.firealert.backend.service;

import com.firealert.backend.dto.DeviceRequest;
import com.firealert.backend.dto.DeviceResponse;
import com.firealert.backend.dto.DeviceToggleRequest;
import com.firealert.backend.model.Device;
import com.firealert.backend.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Device management
 * Handles device creation, updates, and status management
 * Supports remote on/off toggle and heartbeat monitoring
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DeviceService {
    
    private final DeviceRepository deviceRepository;
    
    /**
     * Create a new device for user
     */
    public DeviceResponse createDevice(Integer userId, DeviceRequest request) {
        log.info("Creating device '{}' for user: {}", request.getDeviceName(), userId);
        
        Device device = Device.builder()
                .userId(userId)
                .deviceName(request.getDeviceName())
                .status("ACTIVE")
                .isEnabled(true)
                .build();
        
        Device savedDevice = deviceRepository.save(device);
        log.info("Device created with ID: {}", savedDevice.getDeviceId());
        
        return mapToResponse(savedDevice);
    }
    
    /**
     * Get all devices for user
     */
    public List<DeviceResponse> getUserDevices(Integer userId) {
        log.debug("Fetching devices for user: {}", userId);
        
        return deviceRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get device by ID (verify ownership)
     */
    public DeviceResponse getDeviceById(Integer deviceId, Integer userId) {
        log.debug("Fetching device: {} for user: {}", deviceId, userId);
        
        return deviceRepository.findByDeviceIdAndUserId(deviceId, userId)
                .map(this::mapToResponse)
                .orElseThrow(() -> {
                    log.error("Device not found or unauthorized: {}", deviceId);
                    return new RuntimeException("Device not found or unauthorized access");
                });
    }
    
    /**
     * Toggle device on/off (remote control)
     */
    public DeviceResponse toggleDevice(Integer deviceId, Integer userId, DeviceToggleRequest request) {
        log.info("Toggling device: {} to isEnabled: {}", deviceId, request.getIsEnabled());
        
        Device device = deviceRepository.findByDeviceIdAndUserId(deviceId, userId)
                .orElseThrow(() -> {
                    log.error("Device not found: {}", deviceId);
                    return new RuntimeException("Device not found");
                });
        
        device.setIsEnabled(request.getIsEnabled());
        Device updatedDevice = deviceRepository.save(device);
        
        log.info("Device toggled successfully: {}", deviceId);
        return mapToResponse(updatedDevice);
    }
    
    /**
     * Update device heartbeat (device connectivity check)
     */
    public void updateHeartbeat(Integer deviceId, Integer userId) {
        log.debug("Updating heartbeat for device: {}", deviceId);
        
        Device device = deviceRepository.findByDeviceIdAndUserId(deviceId, userId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        
        device.setLastHeartbeat(LocalDateTime.now());
        deviceRepository.save(device);
    }
    
    /**
     * Delete device
     */
    public void deleteDevice(Integer deviceId, Integer userId) {
        log.info("Deleting device: {} for user: {}", deviceId, userId);
        
        Device device = deviceRepository.findByDeviceIdAndUserId(deviceId, userId)
                .orElseThrow(() -> {
                    log.error("Device not found: {}", deviceId);
                    return new RuntimeException("Device not found");
                });
        
        deviceRepository.delete(device);
        log.info("Device deleted successfully: {}", deviceId);
    }
    
    /**
     * Map Device entity to DeviceResponse DTO
     */
    private DeviceResponse mapToResponse(Device device) {
        return DeviceResponse.builder()
                .deviceId(device.getDeviceId())
                .userId(device.getUserId())
                .deviceName(device.getDeviceName())
                .status(device.getStatus())
                .isEnabled(device.getIsEnabled())
                .lastHeartbeat(device.getLastHeartbeat())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .build();
    }
}
