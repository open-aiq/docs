---
title: Project status
description: Current maturity of each Open AIQ component.
---

Open AIQ is under active development and has not reached 1.0. The
[releases page](../releases/) lists the current versions.

| Area | Status | Notes |
| --- | --- | --- |
| Backend API | Functional | Owner and device auth, ingestion, history, device logs, firmware releases and update jobs |
| Web dashboard | Functional | Device management, local-time history charts, public pages, community map |
| Device firmware | Functional | Rust on ESP32-S3; passkey BLE pairing, device logs, owner-approved OTA with rollback |
| Mobile app | Functional, not yet in stores | Pairing, registration, Wi-Fi and location setup, live readings, settings, updates, logs |
| Transport security | In place | Firmware HTTPS verifies certificates with ESP-IDF's CA bundle; BLE requires passkey pairing |

## Known gaps

- The mobile app isn't published to app stores yet. Build it from source.
- Monitors running the old Arduino firmware need one USB flash to move to the
  Rust firmware and its A/B partition table. After that, updates arrive over
  the air.
- Day and month history buckets use UTC boundaries. Hourly times are shown in
  the viewer's local time.

These docs describe the `main` branch of each repository. Each repository's
README stays the source of truth for its exact commands.
