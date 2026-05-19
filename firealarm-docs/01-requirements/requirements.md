# Smart Fire/Smoke Alert System Requirements

This document records the project requirements and supported development environment. For exact backend run commands, see `be/README.md`.

## Project Scope

The system monitors fire or smoke detection devices, stores device and alert data, and exposes API endpoints for a client application to register users, manage devices, and review alerts.

Current implemented scope:

- Backend REST API with Spring Boot.
- PostgreSQL persistence.
- User registration and lookup.
- Device creation, lookup, heartbeat, toggle, and delete.
- Alert creation, status updates, active alert lookup, and alert history.
- Hardware firmware folder for ESP32/Arduino work.

Current partial or placeholder scope:

- Frontend folder exists, but the real UI implementation is not complete yet.
- Hardware documentation folders exist, with firmware work under `hw/firmware`.

## Functional Requirements

### User Management

- The system shall allow a user to register with email, password, and full name.
- The system shall store passwords as hashes, not plain text.
- The system shall allow user lookup by user ID.
- The system shall reject duplicate email registrations.

### Device Management

- The system shall allow a user to create one or more fire detection devices.
- The system shall allow listing devices for a user.
- The system shall allow retrieving a specific device by device ID and user ID.
- The system shall allow enabling or disabling a device remotely.
- The system shall allow deleting a device.
- The system shall record heartbeat timestamps for device connectivity checks.

### Alert Management

- The system shall allow creating alerts for a device.
- The system shall support alert levels `LOW`, `MEDIUM`, and `HIGH`.
- The system shall support alert statuses such as `ACTIVE`, `CLEARED`, and `DISABLED`.
- The system shall allow retrieving active alerts for a device.
- The system shall allow retrieving alert history for a device.
- The system shall allow clearing or disabling an alert.

### Database

- The system shall use PostgreSQL for backend persistence.
- The local development database name shall be `firealert`.
- The local development database user shall be `firealert_user`.
- Schema updates are currently handled by Hibernate with `ddl-auto=update`.

## Non-Functional Requirements

- Backend development shall use Java 17.
- Backend dependency management shall use Maven 3.9+.
- The backend API shall run on port `8080` by default.
- The backend API context path shall be `/api`.
- The backend shall support a Docker-based setup for teammates who do not have Maven installed.
- Local secrets and environment overrides shall be stored in `.env` and not committed.

## Development Requirements

Required:

- Git
- Docker Desktop
- Docker Compose

Required for local backend development:

- JDK 17
- Apache Maven 3.9+

Optional:

- VS Code with Java extensions.
- PlatformIO extension for firmware development.
- Postman or VS Code REST Client for API testing.

## Supported Backend Run Modes

The backend has two supported run modes.

### Local Maven

Use this for normal VS Code backend development.

- PostgreSQL runs in Docker Compose.
- Spring Boot runs locally with Maven.
- Commands are documented in `be/README.md`.

### Docker Compose

Use this when a teammate does not want to install Maven locally.

- PostgreSQL runs in Docker Compose.
- The API runs in Docker Compose using the built jar.
- Commands are documented in `be/README.md`.

## API Base URL

Default local backend URL:

```text
http://localhost:8080/api
```

Health check:

```text
GET http://localhost:8080/api/users/health
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

## Important Notes

- Do not use `http://localhost:8080/api/health`; that endpoint is not currently implemented.
- Do not assume the frontend is runnable yet. The `fe/` folder currently contains project structure and package metadata, but not a complete implemented app.
- Do not commit `.env`, `target/`, logs, or local database data.

## References

- Backend run guide: `be/README.md`
- Backend configuration: `be/src/main/resources/application.properties`
- Docker Compose setup: `be/docker-compose.yml`
- Backend source: `be/src/main/java/com/firealert/backend`
- Firmware source: `hw/firmware`
