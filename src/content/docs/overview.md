---
title: Overview
description: What Open AIQ is and how its components work together.
---

Open AIQ is an open-source air-quality monitoring system. A physical monitor samples particulate matter and climate data, calculates AQI, shows the latest values locally, and periodically uploads an averaged reading. The web dashboard presents current and historical measurements, while the public map includes only devices whose owners opted into sharing both readings and exact location.

The project consists of four independently versioned components:

| Component | Technology | Responsibility |
| --- | --- | --- |
| Device firmware | ESP32, Arduino, PlatformIO | Sensors, AQI, display, BLE, Wi-Fi, telemetry |
| Backend | Go, Gin, Ent, PostgreSQL | Authentication, device ownership, ingestion, aggregation |
| Dashboard | React, Vite, Tailwind CSS | Private device management and public views |
| Provisioning app | Flutter, `flutter_blue_plus` | Discover and configure monitors over BLE |

The Flutter app is **work in progress**. Firmware provisioning is implemented and can be exercised today with a generic Nordic UART Service client or development-only mock provisioning.

Open AIQ reports US EPA AQI semantics and metric sensor units. It is an educational/community system, not a regulatory or life-safety instrument.
