---
title: Overview
description: What Open AIQ is and how its pieces fit.
---

Open AIQ is an open-source air-quality monitor. It measures particulate matter
and climate every 20 seconds, shows them on its screen, and uploads a
ten-minute average to the backend. You manage monitors from the web dashboard
or the mobile app. The public map shows a monitor only when its owner shares
both readings and location.

Each component is versioned separately; the [releases page](../releases/) shows
which versions belong together.

| Component | Technology | Responsibility |
| --- | --- | --- |
| Device firmware | Rust, ESP-IDF, ESP32-S3 | Sensors, AQI, OLED screen, BLE pairing and provisioning, uploads, device logs, OTA updates |
| Backend | Go, Gin, Ent, PostgreSQL | Accounts, device ownership, ingestion, history, logs, firmware releases and update jobs |
| Web dashboard | React, Vite, Tailwind CSS | Device management, history charts, public device pages and map |
| Mobile app | Flutter, `flutter_blue_plus` | Add monitors over Bluetooth, live readings, settings, firmware updates, logs |

One [Clerk](https://clerk.com) account signs you in to both the dashboard and the app.

Open AIQ reports US EPA AQI in metric units. It's built for learning and
communities, not as a regulatory or life-safety instrument.
