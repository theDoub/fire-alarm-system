package com.firealert.backend.repository;

import com.firealert.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Device entity
 * Provides CRUD operations and custom queries
 */
@Repository
public interface DeviceRepository extends JpaRepository<Device, Integer> {
    
    /**
     * Find all devices for a specific user
     */
    List<Device> findByUserId(Integer userId);
    
    /**
     * Find device by ID and verify it belongs to user
     */
    Optional<Device> findByDeviceIdAndUserId(Integer deviceId, Integer userId);
    
    /**
     * Count devices for a user
     */
    long countByUserId(Integer userId);
}
