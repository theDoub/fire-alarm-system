# 🔥 Smart Fire Alarm System — Quick Start Guide

This guide provides absolute, step-by-step instructions to boot up and run both the Spring Boot Backend API and the React Native/Expo Mobile Application.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:

| System | Tool | Required Version | Link |
| :--- | :--- | :--- | :--- |
| **Backend** | Docker Desktop | Latest | [Docker](https://www.docker.com/) |
| | Eclipse Temurin JDK | Version 17 | [Adoptium](https://adoptium.net/) |
| | Maven | ≥ 3.8.0 | [Maven](https://maven.apache.org/) |
| **Frontend** | Node.js | ≥ 16.0.0 | [NodeJS](https://nodejs.org) |
| | Expo Go App | SDK 54 compatible | [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS App Store](https://apps.apple.com/app/expo-go/id984029728) |

---

## 🚀 Step 1 — Booting the Spring Boot Backend

The backend utilizes PostgreSQL and a Spring Boot API server packaged via Docker.

### 1. Package the Backend application
Open a terminal in the `be/` folder and build the production-ready `.jar` archive:
```bash
cd be
mvn clean package -DskipTests
```
*Alternatively, if you have Docker but don't want to install Maven/JDK locally, use a Maven container:*
```bash
docker run --rm -v "${PWD}:/app" -w /app maven:3.9-eclipse-temurin-17 mvn clean package -DskipTests
```

### 2. Launch the Services with Docker Compose
Start both the PostgreSQL Database (`fire_alarm_db`) and the API Gateway (`fire_alarm_api`):
```bash
docker compose up -d
```

### 3. Verify Backend Telemetry is Live
Check that the containers are healthy and running:
```bash
docker compose ps
```
Stream backend logs to monitor active traffic:
```bash
docker logs -f fire_alarm_api
```
Verify the health check in your browser at:
👉 **[http://localhost:8080/api/](http://localhost:8080/api/)**

---

## 📱 Step 2 — Booting the React Native Mobile App

The frontend is an Expo-managed TypeScript mobile application.

### 1. Install Node Dependencies
Open a new terminal in the `fe/` folder and install packages using legacy peer resolving:
```bash
cd fe
npm install --legacy-peer-deps
```

### 2. Configure Backend Endpoint IP Address
Open the frontend client config file at [`fe/src/api/client.ts`](file:///c:/HCMUT/HK252/Multi%20Project/fire-alarm/fe/src/api/client.ts) and modify `BASE_URL` to point to your backend API's IP address:
```ts
// fe/src/api/client.ts
export const BASE_URL = 'http://<YOUR_PC_IP>:8080/api';
```

> 💡 **Determining Your IP Address:**
> Run `ipconfig` in Windows PowerShell. Look for the **IPv4 Address** under your active Wi-Fi adapter (e.g. `192.168.1.15`).
> * Never use `localhost` or `127.0.0.1` when testing on a physical phone.
> * If testing on an Android Emulator, use `http://10.0.2.2:8080/api`.

### 3. Start Metro Bundler
Boot up the Expo server:
```bash
npx expo start --clear
```

### 4. Connect Your Device
Ensure your phone and PC are connected to the **same Wi-Fi network**.
1. Open the **Expo Go** application on your smartphone.
2. **Scan the QR Code** displayed in the terminal window, OR
3. Tap **"Enter URL manually"** inside the Expo Go app and type:
   `exp://<YOUR_PC_IP>:8081`

*If you experience local network blocking or firewall restrictions, run Expo in Tunnel mode:*
```bash
npx expo start --tunnel
```

---

## 🔑 Default Testing Credentials

Use the following pre-registered credentials on the login screen to sync immediately with the backend API:

* **Email Address**: `vanang@gmail.com`
* **Password**: `123456`

---

## 🛠️ Quick Troubleshooting

### Backend Connection Failures
If the backend does not respond from external devices, add a Windows Defender Firewall rule to open port `8080` (Run PowerShell as Administrator):
```powershell
New-NetFirewallRule -DisplayName "Spring Boot 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

### Resetting Frontend Caches
If Expo fails to fetch assets or load routes, wipe Metro cache and reboot:
```bash
npx expo start --clear
```
