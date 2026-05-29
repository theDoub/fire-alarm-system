package com.firealert.backend.dto;


import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for device creation/update request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceCreateRequest {
    
    @Size(min = 2, max = 255, message = "Device name must be between 2 and 255 characters")
    private String name;

    @Size(max = 255, message = "Location must be at most 255 characters")
    private String location;

    @Size(max = 100, message = "Serial number must be at most 255 characters")
    private String serialNum;
}
