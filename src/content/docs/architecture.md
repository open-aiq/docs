---
title: System architecture
description: Data and control flow across the Open AIQ repositories.
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

- **Device → backend.** The monitor authenticates with a public device ID and a
  secret key on every request, and reports its firmware version. It uploads
  readings (`POST /data`) and important log events (`POST /device/logs`), and
  asks for an approved update (`GET /device/ota`). See
  [Telemetry](../device/telemetry/) and
  [Firmware updates and logs](../device/ota/).
- **Owner → backend.** The dashboard and the mobile app send a Clerk session
  token. Browser tokens are checked against the allowed origins; mobile tokens
  are accepted when the backend allows native clients.
- **Public.** Public device pages and the map need no sign-in and return only
  data an owner has made public.
- **Phone → device.** The mobile app talks to the monitor over Bluetooth
  using newline-delimited text commands on the Nordic UART Service. Every
  command requires an encrypted, passkey-paired link. See
  [BLE provisioning](../device/ble/).

The backend follows `routes → handler → service → repository → database`.
Database migrations run automatically when the backend container starts.

## Shared contracts

A change to any of these must be checked in every affected repository:

| Contract | Producers and consumers |
| --- | --- |
| REST routes and JSON payloads | backend ↔ dashboard, app, firmware |
| Device headers (`X-Device-ID`, `X-Device-Key`, `X-Firmware-Version`) | firmware ↔ backend |
| BLE UUIDs, commands, and reply framing | firmware ↔ app |
| AQI bands, units, sampling intervals, nullable location | all four |

The API reference pages are generated from a committed snapshot of the
backend's Swagger file, so a docs build does not depend on another repository.
