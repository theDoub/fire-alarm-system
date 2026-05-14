package com.firealert.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main Spring Boot Application class
 * Starts the Fire Alert System backend service
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.firealert.backend")
public class FireAlertApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(FireAlertApplication.class, args);
    }
}
