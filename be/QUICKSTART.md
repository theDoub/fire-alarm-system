# Quick Start Guide - Fire Alert Backend

## 🚀 Quick Setup (5 minutes)

### 1. Setup PostgreSQL Database
```bash
# Create database and user
psql -U postgres

CREATE DATABASE firealert;
CREATE USER firealert_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE firealert TO firealert_user;

\q
```

### 2. Update Database Credentials
Edit `be/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/firealert
spring.datasource.username=firealert_user
spring.datasource.password=secure_password_123
```

### 3. Build & Run
```bash
cd be

# Build
mvn clean install -DskipTests

# Run
mvn spring-boot:run
```

### 4. Verify It Works
```bash
curl http://localhost:8080/api/users/health
```

---

## 📁 Key Files Overview

| File | Purpose |
|------|---------|
| `pom.xml` | Maven dependencies (Spring Boot, PostgreSQL, JUnit, Mockito) |
| `application.properties` | Database & server configuration |
| `model/` | JPA entity classes (User, Device, Alert, AlertHistory) |
| `dto/` | API request/response objects |
| `service/` | Business logic (alert evaluation, device management) |
| `controller/` | REST API endpoints |
| `repository/` | Database queries (Spring Data JPA) |

---

## 🔌 API Endpoints Cheat Sheet

### Users
```bash
POST   /api/users/register                          # Register user
GET    /api/users/{userId}                          # Get user
GET    /api/users/health                            # Health check
```

### Devices
```bash
POST   /api/devices?userId={userId}                 # Create device
GET    /api/devices?userId={userId}                 # Get all devices
GET    /api/devices/{deviceId}?userId={userId}      # Get device
PUT    /api/devices/{deviceId}/toggle?userId={userId}  # Toggle on/off
DELETE /api/devices/{deviceId}?userId={userId}      # Delete device
```

### Alerts
```bash
POST   /api/alerts                                  # Trigger alert
GET    /api/alerts?deviceId={deviceId}              # Get all alerts
GET    /api/alerts/active?deviceId={deviceId}       # Get active alerts
GET    /api/alerts/device-history?deviceId={deviceId}  # Get history
PUT    /api/alerts/{alertId}/clear                  # Clear alert
PUT    /api/alerts/{alertId}/disable                # Disable alert
```

---

## 📊 Database Tables

- **users** - User accounts
- **devices** - Fire detection devices (1 user → many devices)
- **alerts** - Alert records (3 levels: LOW, MEDIUM, HIGH)
- **alert_history** - Audit trail of all alerts

---

## ⚙️ Key Features Implemented

✅ User registration with password hashing  
✅ Multiple devices per user  
✅ Real-time alert processing with automatic level evaluation  
✅ 3 alert severity levels (LOW 0-30%, MEDIUM 30-70%, HIGH 70-100%)  
✅ Remote device control (on/off toggle)  
✅ Device heartbeat monitoring  
✅ Alert history & audit trail  
✅ Temporary alert disable  
✅ RESTful API with JSON responses  
✅ Comprehensive error handling  
✅ Unit tests (UserServiceTest, DeviceServiceTest, AlertServiceTest)  
✅ Full logging with SLF4J  

---

## 🧪 Running Tests

```bash
# All tests
mvn test

# Single test
mvn test -Dtest=UserServiceTest

# With coverage
mvn clean test jacoco:report
```

---

## 🔍 Alert Level Evaluation (Smart Feature)

Automatic evaluation based on sensor confidence:
```
Sensor Value    →    Alert Level
0-30%           →    LOW (low confidence)
30-70%          →    MEDIUM (medium confidence)
70-100%         →    HIGH (high confidence - urgent)
```

Example:
```bash
curl -X POST http://localhost:8080/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": 1,
    "sensorValue": 85.5,
    "description": "Smoke detected"
  }'

# Response: Alert with automatically assigned level = "HIGH"
```

---

## 🛠️ Project Structure

```
be/
├── pom.xml                     # Maven config
├── README.md                   # Full documentation
├── QUICKSTART.md              # This file
├── src/main/
│   ├── java/com/firealert/backend/
│   │   ├── FireAlertApplication.java      # Main entry point
│   │   ├── controller/                    # REST endpoints
│   │   ├── service/                       # Business logic
│   │   ├── repository/                    # Data access
│   │   ├── model/                         # JPA entities
│   │   ├── dto/                           # API objects
│   │   ├── config/                        # Configuration
│   │   └── util/                          # Utilities
│   └── resources/
│       └── application.properties         # Configuration
├── src/test/java/com/firealert/backend/
│   ├── UserServiceTest.java
│   ├── DeviceServiceTest.java
│   └── AlertServiceTest.java
└── target/                    # Build output
```

---

## 📝 Common Tasks

### Add New User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Create Device
```bash
curl -X POST "http://localhost:8080/api/devices?userId=1" \
  -H "Content-Type: application/json" \
  -d '{"deviceName": "Living Room Detector"}'
```

### Trigger Alert
```bash
curl -X POST http://localhost:8080/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": 1,
    "alertLevel": "HIGH",
    "sensorValue": 85.5,
    "description": "High smoke detected"
  }'
```

---

## 🐛 Debugging

### Check PostgreSQL is running
```bash
psql -U postgres -l
```

### View application logs
```bash
tail -f logs/application.log
```

### Database connection test
```bash
psql -U firealert_user -d firealert -c "SELECT * FROM users;"
```

### Check running port
```bash
lsof -i :8080
```

---

## 📚 Documentation

- **Full Docs:** See [README.md](README.md)
- **API Docs:** API endpoints and examples in README.md
- **Database Schema:** Database relationships and constraints in README.md

---

## ✨ Code Quality

- Clean architecture (controller → service → repository)
- Separation of concerns (models, DTOs, business logic)
- Comprehensive error handling
- Transaction management
- Full logging coverage
- Unit test coverage
- No hardcoded values

---

## Next Steps

1. ✅ Database setup done
2. ✅ Application running
3. Test API endpoints with Postman or curl
4. Review code in controllers/services
5. Run unit tests: `mvn test`
6. Check logs for any errors
7. Add authentication (JWT) for production
8. Deploy to cloud (Azure, AWS, etc.)

---

**Ready to code!** 🎉

For full documentation, see [README.md](README.md)
