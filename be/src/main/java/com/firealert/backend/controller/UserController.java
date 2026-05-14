package com.firealert.backend.controller;

import com.firealert.backend.dto.ApiResponse;
import com.firealert.backend.dto.UserRegistrationRequest;
import com.firealert.backend.dto.UserResponse;
import com.firealert.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for User management
 * Endpoints for user registration, profile management
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    
    /**
     * Register a new user
     * POST /api/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(
            @Valid @RequestBody UserRegistrationRequest request) {
        log.info("Registering new user: {}", request.getEmail());
        
        try {
            UserResponse response = userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", response, 201));
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }
    
    /**
     * Get user by ID
     * GET /api/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Integer userId) {
        log.info("Fetching user: {}", userId);
        
        try {
            UserResponse response = userService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", response, 200));
        } catch (Exception e) {
            log.error("Error fetching user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/users/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("User service is healthy", "OK", 200));
    }
}
