---
title: API conventions
description: Authentication and usage conventions for the generated endpoint reference.
---

The generated [API reference](../../api/) is authoritative for routes, parameters, payload schemas, and response codes. It is built from `backend/docs/swagger.yaml` and served below `/api/`.

The API base path is `/api/v1`. JSON request bodies use `Content-Type: application/json`.

## Owner authentication

Protected routes require a current Clerk session token:

```http
Authorization: Bearer <clerk-session-token>
```

These include device registration/management and private current/history endpoints. Resources are scoped to the authenticated owner.

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
  --data '{"pms_data":{"pm1_0":5,"pm2_5":12,"pm10_0":18,"provider":"pms5003"},"aqi":57,"temperature_data":{"temperature":31.2,"humidity":64.5,"heat_index":36.8,"provider":"dht22"}}'
```

Public routes under `/public` require no authentication. Avoid embedding owner or device credentials in URLs, examples, client-side logs, or bug reports.
