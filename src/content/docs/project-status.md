---
title: Project status
description: Current maturity and supported paths across Open AIQ.
---

Open AIQ is under active development and has not reached 1.0.

| Area | Status | Notes |
| --- | --- | --- |
| Backend API | Functional | PostgreSQL persistence, Clerk owner auth, device ingestion |
| Web dashboard | Functional | Private dashboard, public pages, community map |
| Firmware | Functional prototype | Sensors, LCD, BLE, Wi-Fi, telemetry; no OTA partition |
| Flutter app | Work in progress | BLE scanning scaffold exists; complete provisioning UI is not available |
| Manual provisioning | Available | Use a generic NUS client or mock provisioning |
| Security hardening | In progress | Firmware TLS currently uses `setInsecure()` |

Documentation describes the current `main`-line contract and is not versioned yet. Repository-specific READMEs remain the source of truth for fast local commands.
