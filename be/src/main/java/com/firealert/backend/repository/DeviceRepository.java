package com.firealert.backend.repository;

import com.firealert.backend.model.entities.Device;
import com.firealert.backend.model.enums.DeviceStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Device entity
 * Provides CRUD operations and custom queries
 */
@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {
    
    /**
     * Find all devices for a specific user
     */
    List<Device> findByUser_Id(UUID userId);
    
    /**
     * Find device by ID and verify it belongs to user
     */
    Optional<Device> findByIdAndUser_Id(UUID id, UUID userId);
    
    /**
     * Count devices for a user
     */
    long countByUser_Id(UUID userId);

    long countByUser_IdAndStatus(UUID userId, DeviceStatus status);

    long countByUser_IdAndIsEnable(UUID userId, Boolean isEnable);

    List<Device> findByUser_IdAndStatus(UUID userId, DeviceStatus status);

    List<Device> findByUser_IdAndIsEnable(UUID userId, Boolean isEnable);

    Boolean existsBySerialNum(String serialNum);
}
