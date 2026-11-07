---
title: Overview
description: What Open AIQ is and how its pieces fit.
---

Open AIQ is an open-source air-quality monitor. A small device measures the
air around it, shows what it finds on its screen, and sends readings to our
backend. You set it up from your phone over Bluetooth, then follow it from the
mobile app or the web dashboard.

Each component is versioned separately; the [releases page](../releases/) shows
which versions go together.

| Component | Technology | Responsibility |
| --- | --- | --- |
| Device firmware | Rust<br />ESP-IDF<br />ESP32-S3 | Sensors<br />AQI<br />OLED screen<br />BLE pairing and provisioning<br />Uploads<br />Device logs<br />OTA updates |
| Backend | Go<br />Gin<br />Ent<br />PostgreSQL | Accounts<br />Device ownership<br />Ingestion<br />History<br />Logs<br />Firmware releases and update jobs |
| Web dashboard | React<br />Vite<br />Tailwind CSS | Device management<br />History charts<br />Public device pages and map |
| Mobile app | Flutter<br />`flutter_blue_plus` | Add monitors over Bluetooth<br />Live readings<br />Settings<br />Firmware updates<br />Logs |

One [Clerk](https://clerk.com) account signs you in to both the dashboard and the app.

Open AIQ is for learning and communities, not a regulatory or life-safety
instrument.
