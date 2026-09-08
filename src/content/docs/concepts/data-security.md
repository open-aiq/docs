---
title: Data, credentials, and security
description: Authentication boundaries, location handling, and current limitations.
---

Open AIQ has two authentication boundaries:

- Dashboard owner routes use a Clerk session token in `Authorization: Bearer …`. The backend verifies the token and authorized-party origin, then scopes queries to the Clerk user ID.
- Hardware ingestion uses `X-Device-ID` and `X-Device-Key`. The ID identifies a monitor; the key is a secret shown once at registration or rotation.

Public endpoints require neither credential. They expose only devices an owner has made public. Exact location additionally requires explicit location sharing.

Keep `.env`, `include/secrets.h`, Clerk secret keys, device keys, database dumps, and release credentials out of Git. Browser-side Clerk publishable keys are designed to be public; backend Clerk secret keys are not. Logs redact authorization and device-key headers, but contributors should still avoid printing request headers.

## Current limitations

ESP32 HTTPS currently calls `setInsecure()`, which encrypts traffic but does not authenticate the server certificate. A network attacker able to intercept TLS could capture device credentials or readings. Certificate validation/pinning remains required before treating the transport as hardened.

The reference partition has no OTA update slot. Physical reflashing is required. BLE provisioning also has no application-level authorization described by the current protocol; provision in a trusted physical environment.
