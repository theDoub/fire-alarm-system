# 🔥 Smart Fire Alarm System — Mobile App (React Native)

> **Stack:** React Native 0.72 · TypeScript · Expo SDK 49 · React Navigation v6 · Zustand · Axios

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the App](#running-the-app)
6. [Project Structure](#project-structure)
7. [Git Collaboration Rules](#git-collaboration-rules)

---

## Prerequisites

Make sure **all** of the following are installed before continuing.

| Tool | Required Version | Download |
| :--- | :--- | :--- |
| Node.js | ≥ 16.0.0 | https://nodejs.org |
| npm | ≥ 8.0.0 | bundled with Node |
| Git | any | https://git-scm.com |
| Java JDK | 17 (for Android build) | https://adoptium.net |
| Android Studio | latest | https://developer.android.com/studio |
| Expo Go (phone) | latest | [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [App Store](https://apps.apple.com/app/expo-go/id982107779) |

> **Windows users:** also install [Windows Subsystem for Android](https://learn.microsoft.com/en-us/windows/android/wsa/) or use a physical Android device / emulator from Android Studio.

---

## Environment Setup

### 1 — Android Studio (first-time only)

1. Open **Android Studio → SDK Manager**
2. Install **Android SDK Platform 33** (Android 13) and **Android SDK Build-Tools 33.0.0**
3. Set the `ANDROID_HOME` environment variable:

```powershell
# Add to your PowerShell profile or System Environment Variables
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
```

4. Create a virtual device: **AVD Manager → Create Virtual Device → Pixel 6 → API 33**

### 2 — Verify your setup

```powershell
node --version      # should print v16.x.x or higher
npm --version       # should print 8.x.x or higher
adb devices         # should list your emulator or physical device
```

---

## Installation

```powershell
# 1. Clone the monorepo (skip if already cloned)
git clone <repo-url>
cd "fire-alarm"

# 2. Navigate to the frontend directory
cd fe

# 3. Install all dependencies
npm install
```

---

## Configuration

### Set the Backend API URL

Open [`src/api/client.ts`](./src/api/client.ts) and update `BASE_URL` to point to Khang's Spring Boot server:

```typescript
// src/api/client.ts
export const BASE_URL = 'http://<BACKEND_IP>:8080/api';
```

| Scenario | Value to use |
| :--- | :--- |
| Spring Boot running on the **same machine** as the emulator | `http://10.0.2.2:8080/api` |
| Spring Boot running on **another machine** on the same Wi-Fi | `http://192.168.x.x:8080/api` |
| Physical device + Spring Boot on your laptop | Use your laptop's **local IP** (run `ipconfig` to find it) |

> ⚠️ **Do NOT use `localhost`** on a physical device — it will fail. Always use an IP address.

---

## Running the App

### Option A — Expo Go (Easiest, Recommended for UI development)

```powershell
# Inside the fe/ directory
npm start
```

This launches the **Expo Dev Server**. Then:
- **Android device/emulator:** Press `a` in the terminal, or scan the QR code with the Expo Go app
- **iOS device:** Scan the QR code with your Camera app (opens in Expo Go)

### Option B — Android Emulator (React Native CLI)

```powershell
# Start the Metro bundler
npm start

# In a NEW terminal — build and deploy to emulator
npm run android
```

> Make sure your emulator is already running in Android Studio before executing `npm run android`.

### Option C — Physical Android Device (USB)

1. Enable **Developer Options** on your phone: *Settings → About Phone → tap Build Number 7 times*
2. Enable **USB Debugging** inside Developer Options
3. Plug in via USB and confirm the prompt on your phone
4. Verify connection: `adb devices` (should show your device)
5. Run:

```powershell
npm run android
```

---

## Troubleshooting

<details>
<summary><strong>Metro bundler stuck or showing module errors</strong></summary>

```powershell
# Clear Metro cache
npm start -- --reset-cache
```
</details>

<details>
<summary><strong>Android build fails with SDK/license errors</strong></summary>

```powershell
# Accept all SDK licenses
$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager --licenses
```
</details>

<details>
<summary><strong>App installed but shows blank / red screen</strong></summary>

- Open the terminal running `npm start` and read the error in red.
- Check that `BASE_URL` in `src/api/client.ts` is reachable from the device.
- Shake the device (or press `m` in terminal) → **Reload** to retry.
</details>

<details>
<summary><strong>Cannot connect to backend (Network Error / ECONNREFUSED)</strong></summary>

1. Confirm Spring Boot is running: open `http://localhost:8080/api/auth/me` in your browser.
2. Confirm the IP in `client.ts` matches your machine's local IP (`ipconfig` on Windows).
3. Disable the Windows Firewall for port 8080, or add an inbound rule for it.
</details>

---

## Project Structure

```text
fe/
└── src/
    ├── api/          # HTTP Client Layer — Axios instance + one service file per Spring Boot controller
    ├── types/        # Pure TypeScript domain type definitions (zero runtime code)
    ├── contexts/     # Global state — AuthContext (JWT), AlertContext (FCM / Level 3 modal)
    ├── hooks/        # Data-fetching hooks — useAlerts, useDevices, useAlertHistory, useSuppression
    ├── navigation/   # RootNavigator, AuthStack, AppStack (Bottom Tabs)
    ├── screens/      # One folder per mockup page (Login, Home, Devices, Alerts, Profile, …)
    ├── components/   # Reusable atomic UI widgets (AlertBadge, DeviceStatusChip, LoadingSpinner)
    ├── services/     # Platform services — FCM push (fcmService), MQTT sensor stream (mqttService)
    ├── store/        # Zustand stores — alertStore (tab badge unread count)
    └── utils/        # Pure helpers — alertHelpers, dateHelpers
```

For the full architecture reference see [`fe_architecture.md`](../firealarm-docs/) or the [architecture artifact](../../).

---

## Git Collaboration Rules

To avoid merge conflicts, each engineer owns specific directories:

| Directory | FE1 (Viet) | FE2 (Phat) |
| :--- | :---: | :---: |
| `src/api/` | ✅ Owner | 🔴 Read only |
| `src/contexts/` | ✅ Owner | 🔴 Read only |
| `src/hooks/` | ✅ Owner | 🔴 Read only |
| `src/services/` | ✅ Owner | 🔴 Read only |
| `src/store/` | ✅ Owner | 🔴 Read only |
| `src/navigation/` | ✅ Owner | 🟡 Joint collab |
| `src/types/` | ✅ Owner | 🟢 Allowed to edit |
| `src/components/common/` | 👁 Reviewer | ✅ Full access |
| `src/screens/` | 👁 Reviewer | ✅ Full access |

### Workflow

```powershell
# Always pull before starting work
git pull origin main

# Work on a feature branch
git checkout -b fe/<your-name>/<feature-name>

# Push and open a Pull Request — never commit directly to main
git push origin fe/<your-name>/<feature-name>
```

**FE2 rule:** consume hook outputs only — do not modify hook internals.

```typescript
// ✅ Correct — consume what the hook exposes
const { devices, toggleCookingMode } = useDevices();

// ❌ Wrong — do not reach into api/ or hooks/ and alter logic
import { deviceService } from '@/api/deviceService';
```