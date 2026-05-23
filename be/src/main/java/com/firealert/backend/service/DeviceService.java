package com.firealert.backend.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firealert.backend.dto.DeviceUpdateRequest;
import com.firealert.backend.dto.DeviceCreateRequest;
import com.firealert.backend.dto.DeviceResponse;
import com.firealert.backend.dto.DeviceToggleRequest;
import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.entities.User;
import com.firealert.backend.model.enums.DeviceStatus;
import com.firealert.backend.repository.DeviceRepository;
import com.firealert.backend.repository.UserRepository;

import lombok.val;

/**
 * Service for Device management
 * Handles device creation, updates, and status management
 * Supports remote on/off toggle and heartbeat monitoring
 */
@Service
public class DeviceService {
    
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public DeviceService(DeviceRepository deviceRepository, UserRepository userRepository){
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<DeviceResponse> getMyDevices(UUID userId, DeviceStatus status){
        List<Device> devices = status == null 
            ? deviceRepository.findByUser_Id(userId) 
            : deviceRepository.findByUser_idAndStatus(status);
        return devices.stream().map(this::toResponse).toList();
    }
    
    @Transactional(readOnly = true)
    public DeviceResponse getMyDevice(UUID userId, UUID deviceId){
        return toResponse(getDeviceOwnedByUser(userId, deviceId));
    }

    @Transactional
    public DeviceResponse createDevice(UUID userId, DeviceCreateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        String serialNum = normalizeSerial(request.getSerialNum());
        if (serialNum != null && deviceRepository.existsBySerialNum(request.getSerialNum())){
            throw new IllegalArgumentException("Serial number is already used");
        }

        Device device = new Device();
        device.setUser(user);
        device.setName(request.getName().trim());
        device.setLocation(normalizeNullable(request.getLocation()));
        device.setSerialNum(serialNum);
        device.setStatus(DeviceStatus.OFFLINE);
        device.setIsEnable(true);

        return toResponse(deviceRepository.save(device));
    }

    @Transactional
    public DeviceResponse updateDevice(UUID userId, UUID deviceId, DeviceUpdateRequest request){
        Device device = getDeviceOwnedByUser(userId, deviceId);

        if (request.getName() != null && !request.getName().isBlank()){
            device.setName(request.getName().trim());
        }

        if (request.getLocation() != null){
            device.setLocation(normalizeNullable(request.getLocation()));
        }

        return toResponse(deviceRepository.save(device));
    }

    @Transactional
    public DeviceResponse toggleDevice(UUID userId, UUID deviceId, DeviceToggleRequest request){
        Device device = getDeviceOwnedByUser(userId, deviceId);
        device.setIsEnable(request.getIsEnabled());
        return toResponse(deviceRepository.save(device));
    }

    @Transactional
    public DeviceResponse updateDeviceStatus(UUID userId, UUID deviceId, DeviceStatus status){
        Device device = getDeviceOwnedByUser(userId, deviceId);
        device.setStatus((status));
        device.setLastSeen(OffsetDateTime.now());
        return toResponse(deviceRepository.save(device));
    }

    @Transactional
    public void deleteDevice(UUID userId, UUID deviceId){
        Device device = getDeviceOwnedByUser(userId, deviceId);
        deviceRepository.delete(device);
    }

    public Device getDeviceOwnedByUser(UUID userId, UUID deviceId){
        return deviceRepository.findByIdAndUser_Id(deviceId, userId)
                            .orElseThrow(() -> new IllegalArgumentException("Device not found"));
    }

    public DeviceResponse toResponse(Device device){
        return DeviceResponse.builder()
                .id(device.getId())
                .userId(device.getUser().getId())
                .name(device.getName())
                .location(device.getLocation())
                .serialNum(device.getSerialNum())
                .status(device.getStatus())
                .isEnable(device.getIsEnable())
                .lastSeen(device.getLastSeen())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .build();
    }

    private String normalizeNullable(String value){
        if (value == null || value.isBlank()){
            return null;
        }
        return value.trim();
    }

    private String normalizeSerial(String value){
        if (value == null || value.isBlank()){
            return null;
        }
        return value.trim().toUpperCase();
    }
}
