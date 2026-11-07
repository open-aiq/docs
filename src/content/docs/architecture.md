---
title: System architecture
description: How data and commands flow between repositories.
---

```text
PMS5003 (UART) + SHT30 (I²C)
          │ sample every 20 s
          ▼
ESP32-S3 firmware ── 128×64 OLED, two buttons
   │  ▲
   │  │ BLE (Nordic UART, passkey pairing): provisioning, live readings
   │  └──────────────── Mobile app (Flutter) ──┐
   │                                           │ Clerk token
   │ HTTPS every 10 min: reading, logs,        ▼
   │ OTA check (X-Device-ID / X-Device-Key)  Go API ── PostgreSQL
   └──────────────────────────────────────►    ▲
                                               │ Clerk token
                                  React dashboard (web)
```

## Runtime boundaries

- **Device → backend.** Each request carries a public device ID, secret key
  and firmware version. The monitor uploads readings (`POST /data`) and log
  events (`POST /device/logs`), and checks for approved updates
  (`GET /device/ota`). See
  [Telemetry](../device/telemetry/) and
  [Firmware updates and logs](../device/ota/).
- **Owner → backend.** Dashboard and app send a Clerk session token. Browser
  tokens are checked against allowed origins; mobile tokens are accepted when
  native clients are enabled.
- **Public.** Device pages and the map need no sign-in and return only data an
  owner made public.
- **Phone → device.** Newline-delimited text commands over the Nordic UART
  Service, on an encrypted, passkey-paired link only. See
  [BLE provisioning](../device/ble/).

Backend requests follow `routes → handler → service → repository → database`.
Migrations apply automatically when the backend container starts.

## Shared contracts

Changing one side alone can break the other, so check every affected repository:

| Contract | Producers and consumers |
| --- | --- |
| REST routes and JSON payloads | backend ↔ dashboard, app, firmware |
| Device headers (`X-Device-ID`, `X-Device-Key`, `X-Firmware-Version`) | firmware ↔ backend |
| BLE UUIDs, commands, and reply framing | firmware ↔ app |
| AQI bands, units, sampling intervals, nullable location | all four |

The API reference is generated from a committed snapshot of the backend's
Swagger file, so the docs build on their own.
