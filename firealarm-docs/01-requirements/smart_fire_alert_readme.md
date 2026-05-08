# Smart Fire/Smoke Alert System – Backend Requirements

## Project Overview
- **Project Name:** Smart Fire/Smoke Alert System  
- **Tech Stack:**
  - Backend: Java  
  - Frontend: React Native (Mobile)  
  - Database: PostgreSQL  
- **Goal:**
  - Provide fire/smoke alerts with 3 severity levels (Low, Medium, High)  
  - Temporarily disable alerts when necessary (e.g., cooking)  
  - Manage multiple devices with remote on/off control  
- **Users:** 1 user can manage multiple devices

## System Components
1. **Backend**
   - RESTful APIs (JSON)  
   - Handles alerts, devices, and user management  
   - Processes sensor data and triggers alerts

2. **Database**
   - Tables: `Users`, `Devices`, `Alerts`, `DeviceStatus`, `AlertHistory`  
   - Relationships:  
     - 1 User → N Devices  
     - 1 Device → N Alerts
   - Include columns, types, primary/foreign keys

3. **Functional Requirements**
- **Alert Management:** 3 levels, log history, allow temporary disable, threshold evaluation
- **Device Management:** multiple devices per user, remote on/off control, status monitoring
- **User Management:** basic info, device association, authentication
- **Real-Time Processing:** evaluate sensor data continuously, trigger alerts within 1s

## Backend API Requirements
| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|---------|
| /alerts | GET | Retrieve list of alerts | userId | JSON list of alerts |
| /alerts | POST | Create new alert | deviceId, level, timestamp | success/fail JSON |
| /alerts/disable | POST | Temporarily disable alert | userId, deviceId, duration | success/fail JSON |
| /devices | GET | Retrieve list of devices | userId | JSON list of devices |
| /devices/:id/toggle | POST | Turn device on/off | userId, deviceId, action | success/fail JSON |

**JSON Schema Example:**
```json
POST /alerts
{
  "device_id": "UUID",
  "level": 2,
  "timestamp": "2026-05-08T12:45:00Z"
}
Response:
{
  "success": true,
  "alert_id": "UUID"
}
```

## Database Schema Example
| Table | Column | Type | Constraints |
|-------|--------|------|-------------|
| Users | id | UUID | PK |
| Users | username | VARCHAR | Unique |
| Devices | id | UUID | PK |
| Devices | user_id | UUID | FK → Users.id |
| Alerts | id | UUID | PK |
| Alerts | device_id | UUID | FK → Devices.id |
| Alerts | level | INT | 1=Low,2=Medium,3=High |
| AlertHistory | alert_id | UUID | FK → Alerts.id |
| AlertHistory | timestamp | TIMESTAMP | Trigger time |

## Backend Flow – Simplified Activity Diagram
```mermaid
flowchart TD
    A[Sensor Devices] -->|Send readings| B[Controller Module]
    B -->|Forward data| C[Server Module]
    C --> D[Process Data / Evaluate Alerts]
    D -->|Update| E[Database: Devices, Alerts, SensorHistory]
    D -->|Trigger alert if needed| F[Notification Service]
    F -->|Push alert| G[Application / Output Modules (Buzzer, LED)]
    C -->|Respond to API requests| H[Backend API Endpoints]
    H -->|GET / POST| I[Frontend App or AI Agent]
    E -->|Provide historical data| H
    H -->|Return JSON| I
```

## Non-Functional Requirements
- Database integrity and relational constraints
- RESTful API conventions
- Scalability to support multiple devices
- Security: API access controlled by userId
- Logging of errors and alert history
- Retry policy for failed sensor data transmissions

## Development Timeline
- **26-30/04:** Design ERD, relational schema, system architecture, and use case diagrams
- **After 30/04:** Implement Backend API (Khang + Phi)
- **15-21/05:** Frontend integration, testing, and hardware communication setup

## Additional Notes 
- Define thresholds for each sensor type (smoke, fire, gas, temperature, sound, light)
- Implement disable logic with duration for alerts
- Ensure all APIs return proper JSON with success/failure and error codes
- Include unit tests for core functionalities