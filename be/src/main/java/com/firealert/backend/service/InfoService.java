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
import com.firealert.backend.repository.DeviceRepository;
import com.firealert.backend.repository.InfoRepository;

@Service
public class InfoService {
    private final InfoRepository infoRepository;
    private final DeviceService deviceService;

    public InfoService(InfoRepository infoRepository, DeviceService deviceService){
        this.infoRepository = infoRepository;
        this.deviceRepository = deviceRepository;
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
        Info info = infoRepository.findfirstByDevice_IdOrderByRecordedAtDesc(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Info not found"));
        return toResponse(info);
    }

    @Transactional
    public InfoResponse createInfo(UUID userId, UUID deviceId, InfoRequest request){
        Device device = deviceService.getDeviceOwnedByUser(userId, deviceId);
        Info info = new Info();
        info.setDevice(device);
        info.setTemperature(request.getTemperature());
        info.setSmoke(request.getSmoke());
        info.setGas(request.getGas());
        info.setFlame(request.getFlame());
        info.setSound(request.getSound());
        info.setLight(request.getLight());
        info.setRecordedAt(request.getRecordedAt());

        return toResponse(infoRepository.save(info));
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
