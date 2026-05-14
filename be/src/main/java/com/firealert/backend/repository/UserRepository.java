package com.firealert.backend.repository;

import com.firealert.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository for User entity
 * Provides CRUD operations and custom queries
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);
}
