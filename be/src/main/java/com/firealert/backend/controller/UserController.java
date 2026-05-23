package com.firealert.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firealert.backend.dto.UserResponse;
import com.firealert.backend.dto.UserUpdateRequest;
import com.firealert.backend.model.entities.User;
import com.firealert.backend.security.CustomUserDetails;
import com.firealert.backend.service.UserService;

import jakarta.validation.Valid;

/**
 * REST Controller for User management
 * Endpoints for user registration, profile management
 */
@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
        @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(userService.getCurrentUser(currentUser.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @Valid @RequestBody UserUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updateCurrentUser(currentUser.getId(), request));
    }
    
}
