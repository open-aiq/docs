---
title: Data, credentials, and security
description: Who can access what, how data is protected, and which secrets to guard.
---

## Who can call what

Each caller has its own credential and reaches only its part of the API:

| Caller | Credential | Scope |
| --- | --- | --- |
| Dashboard | Clerk session token<br />`Authorization: Bearer …` | The signed-in owner's devices. The token's origin (`azp`) must be in `CLERK_AUTHORIZED_PARTIES`. |
| Mobile app | Clerk session token | Same as the dashboard, plus registering devices and rotating their keys. Mobile tokens have no origin; they're accepted when `CLERK_ALLOW_NATIVE_CLIENTS=true`. |
| Monitor | `X-Device-ID`<br />`X-Device-Key` | Its own:<br />Readings<br />Logs<br />Update job |
| Release pipeline | `Authorization: Bearer <FIRMWARE_PUBLISH_TOKEN>` | Publishing firmware releases only |
| Anyone | none | Public device pages<br />The map<br />Only for devices an owner made public |

The device ID (`dev_…`) is public. The device key (`sk_…`) is secret and shown
only once, at creation or key rotation. Those two requests are accepted only
from the mobile app; a dashboard session gets `403 mobile-app-required`. The
app sends the key to the monitor over the encrypted Bluetooth link and never
displays it.

## Transport

- **Device to backend.** HTTPS, verified against ESP-IDF's built-in CA bundle.
- **Phone to device.** Bluetooth LE Secure Connections with passkey entry, so
  every command needs an encrypted, authenticated link. Bluetooth stays off
  until the owner holds both buttons, and each pairing window gets a new random
  6-digit passkey shown only on the monitor. See
  [BLE provisioning](../../device/ble/).
- **Firmware updates.** Images download over HTTPS and must match the published
  SHA-256 and size. Only owner-approved updates install, and a failing image
  rolls back. See [Firmware updates](../../device/ota/).

## Keeping secrets out of Git

Never commit `.env` files, Clerk secret keys, device keys, firmware built with
`MOCK_*` values, database dumps, signing keystores, or release tokens. Clerk
*publishable* keys are designed to be public. The backend redacts authorization
and device-key headers in its logs, and the firmware never logs secrets, since
device logs are uploaded.
