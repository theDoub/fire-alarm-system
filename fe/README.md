# 🔥 Smart Fire Alarm — Mobile App

> React Native · TypeScript · Expo SDK 54 · React Navigation v6 · Zustand · Axios

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the App](#running-the-app)
5. [Project Structure](#project-structure)
6. [Team Collaboration Rules](#team-collaboration-rules)

---

## Prerequisites

| Tool | Version | Link |
| :--- | :--- | :--- |
| Node.js | ≥ 16.0.0 | https://nodejs.org |
| npm | ≥ 8.0.0 | bundled with Node |
| Expo Go (Android/iOS) | **SDK 54 (Latest)** | Play / App Store |

### Install Expo Go (SDK 54)

The project has been upgraded to **Expo SDK 54**. You can install the standard, latest version of **Expo Go** directly from the official app stores:

* **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
* **iOS**: [Apple App Store](https://apps.apple.com/app/expo-go/id984029728)

---

## Installation

```bash
# 1. Clone the repository (skip if already cloned)
git clone <repo-url>

# 2. Go to the frontend directory
cd "fire-alarm/fe"

# 3. Install dependencies (requires --legacy-peer-deps due to modern peer resolutions)
npm install --legacy-peer-deps
```

---

## Configuration

### Set the Backend API URL

Open [`src/api/client.ts`](./src/api/client.ts) and set `BASE_URL` to point to Khang's Spring Boot server:

```ts
// src/api/client.ts
export const BASE_URL = 'http://<BACKEND_IP>:8080/api';
```

| Your situation | Value to use |
| :--- | :--- |
| Spring Boot on the same PC, testing on **emulator** | `http://10.0.2.2:8080/api` |
| Spring Boot on the same PC, testing on **physical phone** | `http://192.168.x.x:8080/api` (your PC's local IP) |

> Find your PC's local IP by running `ipconfig` in PowerShell and looking for **IPv4 Address** under your Wi-Fi adapter.

> ⚠️ Never use `http://localhost` on a physical device — it will always fail.

---

## Running the App

### Step 1 — Start the Expo server

```bash
npx expo start --clear
```

### Step 2 — Connect your phone

Make sure your phone and PC are on the **same Wi-Fi network**, then open **Expo Go (SDK 54)** and:

- **Scan the QR code** shown in the terminal, or
- Tap **"Enter URL manually"** and type `exp://<YOUR_PC_IP>:8081`

### Step 3 — If QR scan doesn't connect

Try tunnel mode — it bypasses all network and firewall issues:

```bash
npx expo start --tunnel
```

Then scan the new QR code it generates.

---

## Troubleshooting

<details>
<summary><b>"Project is incompatible with this version of Expo Go"</b></summary>

Make sure your Expo Go app is updated to the latest version supporting **SDK 54** from the Google Play Store or Apple App Store.
</details>

<details>
<summary><b>App keeps reloading / crash loop</b></summary>

Clear Metro cache and restart:
```bash
npx expo start --clear
```
</details>

<details>
<summary><b>"No apps connected" when pressing r</b></summary>

Your phone has disconnected. Re-scan the QR code or re-enter the URL in Expo Go.
</details>

<details>
<summary><b>Cannot connect to backend (Network Error)</b></summary>

1. Confirm Spring Boot is running on your PC.
2. Run `ipconfig` and use your **IPv4 Address** (not `localhost`) in `client.ts`.
3. Allow port 8080 through Windows Firewall:
```powershell
New-NetFirewallRule -DisplayName "Spring Boot 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```
</details>


---

## Project Structure

```
fe/
├── App.tsx                  ← Root entry point (providers + navigator)
├── app.json                 ← Expo configuration
├── babel.config.js          ← Babel + module-resolver (@/* alias)
├── tsconfig.json            ← TypeScript config (strict, @/* paths)
├── package.json
└── src/
    ├── api/                 ← HTTP layer — one file per Spring Boot controller
    │   ├── client.ts           Axios instance + JWT interceptor
    │   ├── endpoints.ts        All backend route constants
    │   ├── authService.ts      POST /api/auth/login, /register, /logout
    │   ├── deviceService.ts    GET/POST/PUT/DELETE /api/devices
    │   ├── alertService.ts     GET /api/alerts
    │   ├── alertHistoryService.ts  GET /api/alerts/history
    │   └── suppressionService.ts   POST /api/suppressions (Cooking Mode)
    │
    ├── types/               ← TypeScript interfaces (no runtime code)
    │   ├── auth.ts
    │   ├── device.ts
    │   ├── alert.ts
    │   ├── suppression.ts
    │   └── navigation.ts
    │
    ├── contexts/            ← Global state
    │   ├── AuthContext.tsx     Session, login, logout
    │   └── AlertContext.tsx    Live alerts, Level 3 danger modal trigger
    │
    ├── hooks/               ← Data-fetching hooks
    │   ├── useAlerts.ts
    │   ├── useDevices.ts
    │   ├── useAlertHistory.ts
    │   └── useSuppression.ts
    │
    ├── navigation/          ← React Navigation setup
    │   ├── RootNavigator.tsx   Auth ↔ App switch
    │   ├── AuthStack.tsx       Login screen
    │   └── AppStack.tsx        Bottom tabs: Home | Devices | Alerts | Profile
    │
    ├── screens/             ← One folder per UI mockup
    │   ├── Login/
    │   ├── Home/
    │   ├── Devices/
    │   ├── DeviceInfo/         Device detail + Cooking Mode toggle
    │   ├── Alerts/             4-tab severity view (All / Low / Medium / High)
    │   ├── AlertInfo/          Full-screen Level 3 danger modal
    │   ├── AlertHistory/       Paginated audit log
    │   └── Profile/
    │
    ├── components/common/   ← Reusable UI widgets
    │   ├── AlertBadge.tsx
    │   ├── DeviceStatusChip.tsx
    │   ├── LoadingSpinner.tsx
    │   └── ErrorBoundary.tsx
    │
    ├── services/            ← Platform services
    │   ├── fcmService.ts       Firebase push (stubbed — needs dev build)
    │   └── mqttService.ts      MQTT sensor stream (stubbed)
    │
    ├── store/               ← Zustand global stores
    │   └── alertStore.ts       Active alerts + tab badge count
    │
    └── utils/               ← Pure helper functions
        ├── alertHelpers.ts
        └── dateHelpers.ts
```

---

## Team Collaboration Rules

### Folder Ownership

| Directory | FE1 (Viet) | FE2 (Phat) |
| :--- | :---: | :---: |
| `src/api/` | ✅ Owner | 🔴 Read only |
| `src/contexts/` | ✅ Owner | 🔴 Read only |
| `src/hooks/` | ✅ Owner | 🔴 Read only |
| `src/services/` | ✅ Owner | 🔴 Read only |
| `src/store/` | ✅ Owner | 🔴 Read only |
| `src/navigation/` | ✅ Owner | 🟡 Joint collab |
| `src/types/` | ✅ Owner | 🟢 Can edit |
| `src/components/common/` | 👁 Reviewer | ✅ Full access |
| `src/screens/` | 👁 Reviewer | ✅ Full access |

### Git Workflow

```bash
# Always pull before starting
git pull origin main

# Work on your own branch
git checkout -b fe/<your-name>/<feature>

# Push and open a Pull Request — never push directly to main
git push origin fe/<your-name>/<feature>
```

### FE2 Rule — Consume hooks, don't modify them

```ts
// ✅ Correct
const { devices, toggleCookingMode } = useDevices();

// ❌ Wrong — do not reach into hooks or api/ internals
import { deviceService } from '@/api/deviceService';
```