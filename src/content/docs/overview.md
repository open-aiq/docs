---
title: Overview
description: What Open AIQ is and how its components work together.
---

Open AIQ is an open-source air-quality monitoring system. A monitor samples
particulate matter and climate every 20 seconds, shows the latest values on its
screen, and uploads a ten-minute average to the backend. Owners manage their
monitors from the web dashboard or the mobile app. The public map shows only
monitors whose owners chose to share both readings and location.

Four components are versioned on their own. The
[releases page](../releases/) shows which versions belong together.

| Component | Technology | Responsibility |
| --- | --- | --- |
| Device firmware | Rust, ESP-IDF, ESP32-S3 | Sensors, AQI, OLED screen, BLE pairing and provisioning, uploads, device logs, OTA updates |
| Backend | Go, Gin, Ent, PostgreSQL | Accounts, device ownership, ingestion, history, logs, firmware releases and update jobs |
| Web dashboard | React, Vite, Tailwind CSS | Device management, history charts, public device pages and map |
| Mobile app | Flutter, `flutter_blue_plus` | Add monitors over Bluetooth, live readings, settings, firmware updates, logs |

Sign-in for the dashboard and the app uses [Clerk](https://clerk.com), with
one account for both.

Open AIQ reports US EPA AQI and metric units. It is an educational and community
system, not a regulatory or life-safety instrument.
