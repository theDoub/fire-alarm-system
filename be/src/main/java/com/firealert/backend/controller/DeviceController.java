package com.firealert.backend.controller;

import com.firealert.backend.dto.DeviceCreateRequest;
import com.firealert.backend.dto.DeviceResponse;
import com.firealert.backend.dto.DeviceToggleRequest;
import com.firealert.backend.dto.DeviceUpdateRequest;
import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.enums.DeviceStatus;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.service.DeviceService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Device management
 * Endpoints for device CRUD operations and remote control
 */
@RestController
@RequestMapping("/devices")
public class DeviceController {
    
    private final DeviceService deviceService;
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }
    
    @GetMapping
    public ResponseEntity<List<DeviceResponse>> getMyDevices(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @RequestParam(required = false) DeviceStatus status
    ) {
        return ResponseEntity.ok(deviceService.getMyDevices(currentUser.getId(), status));
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<DeviceResponse> getMyDevice(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @PathVariable UUID deviceId 
    ) {
        return ResponseEntity.ok(deviceService.getMyDevice(currentUser.getId(), deviceId));
    }

    @PostMapping
    public ResponseEntity<DeviceResponse> createDevice(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @Valid @RequestBody DeviceCreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            deviceService.createDevice(currentUser.getId(), request)
        );
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<DeviceResponse> updateDevice(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @PathVariable UUID deviceId,
        @Valid @RequestBody DeviceUpdateRequest request
    ) {
        return ResponseEntity.ok(deviceService.updateDevice(currentUser.getId(), deviceId, request));
    }

    @PatchMapping("/{deviceId}/toggle")
    public ResponseEntity<DeviceResponse> toggleDevice(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId,
            @Valid @RequestBody DeviceToggleRequest request
    ) {
        return ResponseEntity.ok(
                deviceService.toggleDevice(currentUser.getId(), deviceId, request)
        );
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteDevice(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId
    ) {
        deviceService.deleteDevice(currentUser.getId(), deviceId);
        return ResponseEntity.noContent().build();
    }
}
