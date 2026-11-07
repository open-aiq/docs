---
title: API conventions
description: Authentication and conventions behind the endpoint reference.
---

The generated [API reference](../../api/) (from `backend/docs/swagger.yaml`,
served below `/api/`) is the authority for routes, parameters, schemas and
response codes. This page covers who can call what.

- Base path: `/api/v1`.
- JSON bodies use `Content-Type: application/json`.
- Errors use [RFC 9457 Problem Details](../errors/) (`application/problem+json`).

## Owner authentication

Protected routes need a current Clerk session token:

```http
Authorization: Bearer <clerk-session-token>
```

That covers device registration and management, private current/history,
firmware update (`/devices/{id}/ota`) and device log (`/devices/{id}/logs`)
endpoints. Resources are scoped to the signed-in owner.

| Client | Accepted when |
| --- | --- |
| Browser | Token's authorized party (`azp`) is listed in `CLERK_AUTHORIZED_PARTIES` |
| Mobile app | Token has no `azp` and `CLERK_ALLOW_NATIVE_CLIENTS=true` |

## Device authentication

Devices upload with two headers:

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

Devices also send `X-Firmware-Version: <semver>` so owners are offered newer
firmware. The same headers authenticate every device route:

| Route | Purpose |
| --- | --- |
| `POST /data` | Upload a reading |
| `POST /device/logs` | Upload up to 50 important log entries (20 uploads per hour) |
| `GET /device/ota` | Get the owner-approved update, or `null` |
| `POST /device/ota/status` | Report update progress; `409` means the job was cancelled or already finished |

## Firmware publishing

The device release pipeline calls `POST /firmware/releases` to register an OTA
image (version, HTTPS URL, SHA-256, size, notes), authorized with
`Authorization: Bearer <FIRMWARE_PUBLISH_TOKEN>`. The image itself lives
elsewhere, such as a GitHub release asset.

## Public routes

Routes under `/public` need no authentication. Keep owner and device
credentials out of URLs, examples, client-side logs and bug reports.
