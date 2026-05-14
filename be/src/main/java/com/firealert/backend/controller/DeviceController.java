package com.firealert.backend.controller;

import com.firealert.backend.dto.*;
import com.firealert.backend.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Device management
 * Endpoints for device CRUD operations and remote control
 */
@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
@Slf4j
public class DeviceController {
    
    private final DeviceService deviceService;
    
    /**
     * Create a new device for user
     * POST /api/devices
     */
    @PostMapping
    public ResponseEntity<ApiResponse<DeviceResponse>> createDevice(
            @RequestParam Integer userId,
            @Valid @RequestBody DeviceRequest request) {
        log.info("Creating device for user: {}", userId);
        
        try {
            DeviceResponse response = deviceService.createDevice(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Device created successfully", response, 201));
        } catch (Exception e) {
            log.error("Error creating device: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }
    
    /**
     * Get all devices for user
     * GET /api/devices?userId={userId}
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<DeviceResponse>>> getUserDevices(
            @RequestParam Integer userId) {
        log.info("Fetching devices for user: {}", userId);
        
        try {
            List<DeviceResponse> devices = deviceService.getUserDevices(userId);
            return ResponseEntity.ok(ApiResponse.success("Devices retrieved successfully", devices, 200));
        } catch (Exception e) {
            log.error("Error fetching devices: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), 500));
        }
    }
    
    /**
     * Get device by ID
     * GET /api/devices/{deviceId}?userId={userId}
     */
    @GetMapping("/{deviceId}")
    public ResponseEntity<ApiResponse<DeviceResponse>> getDevice(
            @PathVariable Integer deviceId,
            @RequestParam Integer userId) {
        log.info("Fetching device: {} for user: {}", deviceId, userId);
        
        try {
            DeviceResponse response = deviceService.getDeviceById(deviceId, userId);
            return ResponseEntity.ok(ApiResponse.success("Device retrieved successfully", response, 200));
        } catch (Exception e) {
            log.error("Error fetching device: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
    
    /**
     * Toggle device on/off (remote control)
     * PUT /api/devices/{deviceId}/toggle?userId={userId}
     */
    @PutMapping("/{deviceId}/toggle")
    public ResponseEntity<ApiResponse<DeviceResponse>> toggleDevice(
            @PathVariable Integer deviceId,
            @RequestParam Integer userId,
            @Valid @RequestBody DeviceToggleRequest request) {
        log.info("Toggling device: {} for user: {}", deviceId, userId);
        
        try {
            DeviceResponse response = deviceService.toggleDevice(deviceId, userId, request);
            return ResponseEntity.ok(ApiResponse.success("Device toggled successfully", response, 200));
        } catch (Exception e) {
            log.error("Error toggling device: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }
    
    /**
     * Update device heartbeat (connectivity check)
     * POST /api/devices/{deviceId}/heartbeat?userId={userId}
     */
    @PostMapping("/{deviceId}/heartbeat")
    public ResponseEntity<ApiResponse<String>> updateHeartbeat(
            @PathVariable Integer deviceId,
            @RequestParam Integer userId) {
        log.info("Updating heartbeat for device: {}", deviceId);
        
        try {
            deviceService.updateHeartbeat(deviceId, userId);
            return ResponseEntity.ok(ApiResponse.success("Heartbeat updated successfully", "OK", 200));
        } catch (Exception e) {
            log.error("Error updating heartbeat: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
    
    /**
     * Delete device
     * DELETE /api/devices/{deviceId}?userId={userId}
     */
    @DeleteMapping("/{deviceId}")
    public ResponseEntity<ApiResponse<String>> deleteDevice(
            @PathVariable Integer deviceId,
            @RequestParam Integer userId) {
        log.info("Deleting device: {} for user: {}", deviceId, userId);
        
        try {
            deviceService.deleteDevice(deviceId, userId);
            return ResponseEntity.ok(ApiResponse.success("Device deleted successfully", "OK", 200));
        } catch (Exception e) {
            log.error("Error deleting device: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/devices/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Device service is healthy", "OK", 200));
    }
}
