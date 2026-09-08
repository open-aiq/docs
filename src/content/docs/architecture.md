---
title: System architecture
description: Data and control flow across the Open AIQ repositories.
---

```text
PMS5003 + DHT22
       │ every 20 s
       ▼
ESP32 firmware ── LCD
       │ averaged upload every 10 min
       │ X-Device-ID + X-Device-Key
       ▼
Go API ───────── PostgreSQL
  ▲                    │
  │ Clerk bearer token │ current/history
  └──── React dashboard┘

Flutter / generic BLE client ── Nordic UART ──► ESP32 configuration
```

## Runtime boundaries

The device posts readings to `POST /api/v1/data`. That route authenticates hardware with a public device ID and a secret key. Owner-facing routes use Clerk session bearer tokens. Public device and map routes require no authentication but return only explicitly published data.

The backend follows `routes → handler → service → repository → database`. The dashboard’s API client is the browser-facing consumer. Firmware and Flutter share a separate BLE contract: newline-delimited commands sent over Nordic UART, with newline-delimited responses that may span notifications.

## Shared contracts

Changes to routes, JSON payloads, device headers, BLE UUIDs/commands, AQI meaning, units, or location nullability must be checked in every affected repository. Generated API pages use a committed snapshot of the backend Swagger file so a docs build does not depend on another repository.
