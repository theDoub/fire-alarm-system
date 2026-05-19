package com.firealert.backend.repository;

import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.entities.Info;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface InfoRepository extends JpaRepository<Info, UUID> {

    List<Info> findByDevice_IdOrderByRecordedAtDesc(UUID deviceId);

    Optional<Info> findfirstByDevice_IdOrderByRecordedAtDesc(UUID deviceId);
    
    List<Info> findByDevice_IdAndRecordedAtBetweenOrderByRecordedAtDesc(
        UUID deviceId,
        OffsetDateTime starTime,
        OffsetDateTime endTime
    );
}