---
title: API conventions
description: Authentication and usage conventions for the generated endpoint reference.
---

The generated [API reference](../../api/) is authoritative for routes, parameters, payload schemas, and response codes. It is built from `backend/docs/swagger.yaml` and served below `/api/`.

The API base path is `/api/v1`. JSON request bodies use `Content-Type: application/json`.
Errors use [RFC 9457 Problem Details](../errors/) with the `application/problem+json` media type.

## Owner authentication

Protected routes require a current Clerk session token:

```http
Authorization: Bearer <clerk-session-token>
```

These include device registration/management, private current/history, firmware update (`/devices/{id}/ota`) and device log (`/devices/{id}/logs`) endpoints. Resources are scoped to the authenticated owner.

Browser tokens must carry an authorized party (`azp`) listed in `CLERK_AUTHORIZED_PARTIES`. Tokens issued to the mobile app carry no `azp`; they are accepted when `CLERK_ALLOW_NATIVE_CLIENTS=true`.

## Device authentication

Physical devices upload with two headers:

```http
X-Device-ID: dev_...
X-Device-Key: sk_...
```

```bash
curl -X POST 'https://backend.example/api/v1/data' \
  -H 'Content-Type: application/json' \
  -H 'X-Device-ID: dev_...' \
  -H 'X-Device-Key: sk_...' \
  --data '{"pms_data":{"pm1_0":5,"pm2_5":12,"pm10_0":18,"provider":"pms5003"},"aqi":57,"temperature_data":{"temperature":31.2,"humidity":64.5,"heat_index":36.8,"provider":"sht30"}}'
```

Devices also send `X-Firmware-Version: <semver>` so owners are offered newer firmware. The same headers authenticate the other device routes:

| Route | Purpose |
| --- | --- |
| `POST /data` | Upload a reading |
| `POST /device/logs` | Upload up to 50 important log entries (20 uploads per hour) |
| `GET /device/ota` | Get the owner-approved update, or `null` |
| `POST /device/ota/status` | Report update progress; `409` means the job was cancelled or already finished |

## Firmware publishing

`POST /firmware/releases` registers an OTA image (version, HTTPS URL, SHA-256, size, notes). It is authorized with `Authorization: Bearer <FIRMWARE_PUBLISH_TOKEN>` and meant for the device release pipeline. The image itself is hosted elsewhere, e.g. as a GitHub release asset.

Public routes under `/public` require no authentication. Avoid embedding owner or device credentials in URLs, examples, client-side logs, or bug reports.
