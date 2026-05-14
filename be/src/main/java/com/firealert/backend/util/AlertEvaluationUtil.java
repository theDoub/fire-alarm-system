package com.firealert.backend.util;

import lombok.extern.slf4j.Slf4j;

/**
 * Alert Evaluation Utility
 * Contains logic for evaluating alert levels and thresholds
 */
@Slf4j
public class AlertEvaluationUtil {
    
    // Sensor value thresholds (confidence percentage)
    private static final double LOW_THRESHOLD = 30.0;
    private static final double MEDIUM_THRESHOLD = 70.0;
    private static final double HIGH_THRESHOLD = 100.0;
    
    /**
     * Evaluate alert level based on sensor value
     * LOW: 0-30%
     * MEDIUM: 30-70%
     * HIGH: 70-100%
     * 
     * @param sensorValue confidence percentage (0-100)
     * @return alert level string
     */
    public static String evaluateAlertLevel(Double sensorValue) {
        if (sensorValue == null || sensorValue < 0) {
            return "LOW";
        }
        
        if (sensorValue >= HIGH_THRESHOLD) {
            return "HIGH";
        } else if (sensorValue >= MEDIUM_THRESHOLD) {
            return "MEDIUM";
        } else if (sensorValue >= LOW_THRESHOLD) {
            return "LOW";
        } else {
            return "LOW";
        }
    }
    
    /**
     * Get severity score for alert level
     * Used for sorting and prioritization
     * 
     * @param alertLevel alert level string
     * @return severity score (1-3, higher is more severe)
     */
    public static int getSeverityScore(String alertLevel) {
        switch (alertLevel) {
            case "HIGH":
                return 3;
            case "MEDIUM":
                return 2;
            case "LOW":
                return 1;
            default:
                return 0;
        }
    }
    
    /**
     * Check if alert requires immediate action
     * HIGH and MEDIUM alerts are critical
     * 
     * @param alertLevel alert level
     * @return true if immediate action required
     */
    public static boolean isAlertCritical(String alertLevel) {
        return alertLevel.equals("HIGH") || alertLevel.equals("MEDIUM");
    }
}
