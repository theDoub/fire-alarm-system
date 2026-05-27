package com.firealert.backend.controller;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.firealert.backend.dto.InfoRequest;
import com.firealert.backend.dto.InfoResponse;
import com.firealert.backend.security.CustomUserDetailService;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.service.InfoService;

import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/devices/{deviceId}/infos")
public class InfoController {
    private final InfoService infoService;

    public InfoController(InfoService infoService) {
        this.infoService = infoService;
    }

    @GetMapping
    public ResponseEntity<List<InfoResponse>> getInfosByDevice(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @PathVariable UUID deviceId,
        @RequestParam(required =  false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        OffsetDateTime startTime,
        @RequestParam(required =  false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        OffsetDateTime endTime
    ) {
        return ResponseEntity.ok(infoService.getInfosByDevice(
            currentUser.getId(),
            deviceId, 
            startTime, 
            endTime)
        );
    }

    @GetMapping("/latest")
    public ResponseEntity<InfoResponse> getLatestInfo(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId
    ) {
        return ResponseEntity.ok(
                infoService.getLatestInfo(currentUser.getId(), deviceId)
        );
    }

    @PostMapping
    public ResponseEntity<InfoResponse> createInfo(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID deviceId,
            @Valid @RequestBody InfoRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                infoService.createInfo(currentUser.getId(), deviceId, request)
        );
    }
}
