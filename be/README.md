# Smart Fire/Smoke Alert Backend

Spring Boot backend for the Smart Fire/Smoke Alert system.

The backend can be run in two supported ways:

1. Local Java + Maven, with PostgreSQL from Docker Compose.
2. Docker Compose for both PostgreSQL and the API.

Use method 1 for normal backend development in VS Code. Use method 2 when a teammate does not want to install Maven locally.

## Requirements

Required for both methods:

- Git
- Docker Desktop
- Docker Compose

Required for local Maven development:

- JDK 17
- Apache Maven 3.9+

Recommended versions used on this machine:

```text
Java: 17.0.12
Maven: 3.9.15
Spring Boot: 3.4.0
PostgreSQL: 15 via Docker
```

Check local Java and Maven:

```powershell
java -version
mvn --version
```

`mvn --version` should show Java 17. If it shows Java 25 or another version, set `JAVA_HOME` to JDK 17.

## Environment

Create a local `.env` file from the example:

```powershell
copy .env.example .env
```

Default values:

```env
DB_NAME=firealert
DB_USER=firealert_user
DB_PASSWORD=secure_password_123
DB_PORT=5432

SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api
```

Do not commit `.env`.

## Method 1: Run Locally With Maven

This is the recommended way for development in VS Code.

Start PostgreSQL:

```powershell
docker compose up -d db
```

Build:

```powershell
mvn clean install -DskipTests
```

Run:

```powershell
mvn spring-boot:run
```

The API runs at:

```text
http://localhost:8080/api
```

Verify:

```powershell
Invoke-RestMethod http://localhost:8080/api/users/health
```

Expected response:

```json
{
  "success": true,
  "message": "User service is healthy",
  "data": "OK",
  "statusCode": 200
}
```

Run tests:

```powershell
mvn test
```

## Method 2: Run With Docker Compose

This method runs both PostgreSQL and the API in Docker.

Build the jar first:

```powershell
mvn clean package -DskipTests
```

If Maven is not installed locally, build with Maven in Docker:

```powershell
docker run --rm -v "${PWD}:/app" -w /app maven:3.9-eclipse-temurin-17 mvn clean package -DskipTests
```

Start PostgreSQL and API:

```powershell
docker compose up -d api
```

Check services:

```powershell
docker compose ps
```

Expected services:

- `fire_alarm_db` on port `5432`
- `fire_alarm_api` on port `8080`

Verify:

```powershell
Invoke-RestMethod http://localhost:8080/api/users/health
```

Stop Docker services:

```powershell
docker compose down
```

Reset the local database:

```powershell
docker compose down -v
```

Use `down -v` only when you want to delete local PostgreSQL data.

## API Examples

Create a user:

```powershell
$body = @{
  email = "test@example.com"
  password = "password123"
  fullName = "Test User"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri http://localhost:8080/api/users/register `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Create a device:

```powershell
$body = @{ deviceName = "Kitchen Detector" } | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:8080/api/devices?userId=1" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Common Endpoints

```text
GET  /api/users/health
POST /api/users/register
GET  /api/users/{userId}
POST /api/devices?userId={userId}
GET  /api/devices?userId={userId}
POST /api/alerts
GET  /api/alerts?deviceId={deviceId}
```

### Maven uses the wrong Java version

Set `JAVA_HOME` to JDK 17:

```text
C:\Program Files\Java\jdk-17
```

Then reopen VS Code or PowerShell and check:

```powershell
mvn --version
```

### Port 8080 is already in use

Edit `.env`:

```env
SERVER_PORT=8081
```

Restart the app and use:

```text
http://localhost:8081/api
```

### Port 5432 is already in use

Edit `.env`:

```env
DB_PORT=5433
```

Restart Docker:

```powershell
docker compose down
docker compose up -d db
```

The API container still uses `db:5432` internally when running with Docker Compose.

### View Docker logs

```powershell
docker compose logs -f api
docker compose logs -f db
```
