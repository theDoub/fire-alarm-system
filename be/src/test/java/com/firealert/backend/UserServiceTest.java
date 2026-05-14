package com.firealert.backend.service;

import com.firealert.backend.dto.UserRegistrationRequest;
import com.firealert.backend.model.User;
import com.firealert.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * Unit tests for UserService
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    private UserRegistrationRequest registrationRequest;
    private User mockUser;
    
    @BeforeEach
    void setUp() {
        registrationRequest = UserRegistrationRequest.builder()
                .email("test@example.com")
                .password("password123")
                .fullName("Test User")
                .build();
        
        mockUser = User.builder()
                .userId(1)
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .fullName("Test User")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    @Test
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        
        assertDoesNotThrow(() -> userService.registerUser(registrationRequest));
    }
    
    @Test
    void testRegisterUser_EmailAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        
        assertThrows(RuntimeException.class, () -> userService.registerUser(registrationRequest));
    }
    
    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(mockUser));
        
        assertDoesNotThrow(() -> userService.getUserById(1));
    }
    
    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(999)).thenReturn(java.util.Optional.empty());
        
        assertThrows(RuntimeException.class, () -> userService.getUserById(999));
    }
}
