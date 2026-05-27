package com.firealert.backend.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firealert.backend.dto.InfoRequest;
import com.firealert.backend.dto.InfoResponse;
import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.entities.Info;
import com.firealert.backend.model.enums.AlertLevel;
import com.firealert.backend.repository.InfoRepository;
import com.firealert.backend.dto.AlertCreateRequest;

@Service
public class InfoService {
    private final InfoRepository infoRepository;
    private final DeviceService deviceService;
    private final AlertService alertService;

    private boolean exceedsThreshold(InfoRequest request) {
        return isOver(request.getTemperature()) ||
                isOver(request.getSmoke()) ||
                isOver(request.getGas()) ||
                isOver(request.getFlame()) ||
                isOver(request.getSound()) ||
                isOver(request.getLight());
    }

    private boolean isOver(Double value) {
        return value != null && value >= 100.0;
    }

    private Integer calculateRisk(InfoRequest request) {
        int risk = 0;

        if (isOver(request.getTemperature())) risk += 20;
        if (isOver(request.getSmoke())) risk += 20;
        if (isOver(request.getGas())) risk += 20;
        if (isOver(request.getFlame())) risk += 25;
        if (isOver(request.getSound())) risk += 5;
        if (isOver(request.getLight())) risk += 10;

        return Math.min(risk, 100);
    }

    private AlertLevel resolveAlertLevel(InfoRequest request) {
        Integer risk = calculateRisk(request);

        if (risk >= 70) {
            return AlertLevel.HIGH;
        }

        if (risk >= 40) {
            return AlertLevel.MEDIUM;
        }

        return AlertLevel.LOW;
    }

    private String buildAlertMessage(InfoRequest request) {
        StringBuilder message = new StringBuilder("Threshold exceeded: ");

        if (isOver(request.getTemperature())) {
            message.append("temperature=").append(request.getTemperature()).append("; ");
        }

        if (isOver(request.getSmoke())) {
            message.append("smoke=").append(request.getSmoke()).append("; ");
        }

        if (isOver(request.getGas())) {
            message.append("gas=").append(request.getGas()).append("; ");
        }

        if (isOver(request.getFlame())) {
            message.append("flame=").append(request.getFlame()).append("; ");
        }

        if (isOver(request.getSound())) {
            message.append("sound=").append(request.getSound()).append("; ");
        }

        if (isOver(request.getLight())) {
            message.append("light=").append(request.getLight()).append("; ");
        }

        return message.toString();
    }

    public InfoService(InfoRepository infoRepository, DeviceService deviceService, AlertService alertService){
        this.infoRepository = infoRepository;
        this.deviceService = deviceService;
        this.alertService = alertService;
    }

    @Transactional(readOnly = true)
    public List<InfoResponse> getInfosByDevice(UUID userId, UUID deviceId, OffsetDateTime start, OffsetDateTime end){
        deviceService.getDeviceOwnedByUser(userId, deviceId);
        List<Info> infos = (start != null && end != null)? infoRepository.findByDevice_IdAndRecordedAtBetweenOrderByRecordedAtDesc(deviceId, start, end) : infoRepository.findByDevice_IdOrderByRecordedAtDesc(deviceId);
        return infos.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InfoResponse getLatestInfo(UUID userId, UUID deviceId){
        deviceService.getDeviceOwnedByUser(userId, deviceId);
        Info info = infoRepository.findFirstByDevice_IdOrderByRecordedAtDesc(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Info not found"));
        return toResponse(info);
    }

    @Transactional
    public InfoResponse createInfo(UUID userId, UUID deviceId, InfoRequest request){
        Device device = deviceService.getDeviceOwnedByUser(userId, deviceId);

        OffsetDateTime now = OffsetDateTime.now();

        Info info = new Info();
        info.setDevice(device);
        info.setTemperature(request.getTemperature());
        info.setSmoke(request.getSmoke());
        info.setGas(request.getGas());
        info.setFlame(request.getFlame());
        info.setSound(request.getSound());
        info.setLight(request.getLight());
        info.setRecordedAt(now);

        Info savedInfo = infoRepository.save(info);

        if (exceedsThreshold(request)) {
            AlertCreateRequest alertRequest = new AlertCreateRequest();
            alertRequest.setInfoId(savedInfo.getId());
            alertRequest.setLevel(resolveAlertLevel(request));
            alertRequest.setTitle("Fire risk detected");
            alertRequest.setMessage(buildAlertMessage(request));
            alertRequest.setRisk(calculateRisk(request));

            alertService.createAlert(userId, deviceId, alertRequest);
        }

        return toResponse(savedInfo);
    }

    private InfoResponse toResponse(Info info){
        return InfoResponse.builder()
                .id(info.getId())
                .deviceId(info.getDevice().getId())
                .temperature(info.getTemperature())
                .smoke(info.getSmoke())
                .gas(info.getGas())
                .flame(info.getFlame())
                .sound(info.getSound())
                .light(info.getLight())
                .recordedAt(info.getRecordedAt())
                .build();
    }
}
