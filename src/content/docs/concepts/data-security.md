---
title: Data, credentials, and security
description: Authentication boundaries, transport security, and handling secrets.
---

## Who can call what

| Caller | Credential | Scope |
| --- | --- | --- |
| Dashboard | Clerk session token, `Authorization: Bearer …` | The signed-in owner's devices. The token's origin (`azp`) must be in `CLERK_AUTHORIZED_PARTIES`. |
| Mobile app | Clerk session token | Same as the dashboard. Mobile tokens have no origin and are accepted when `CLERK_ALLOW_NATIVE_CLIENTS=true`. |
| Monitor | `X-Device-ID` + `X-Device-Key` | Its own readings, logs, and update job |
| Release pipeline | `Authorization: Bearer <FIRMWARE_PUBLISH_TOKEN>` | Publishing firmware releases only |
| Anyone | none | Public device pages and the map, only for devices an owner made public |

The device ID (`dev_…`) is public. The device key (`sk_…`) is a secret shown
once, when the device is created or its key is rotated. When the app registers a
monitor, it sends the key straight to the monitor over the encrypted Bluetooth
link and never displays it.

## Transport

- **Device to backend.** HTTPS with certificate verification against ESP-IDF's
  built-in CA bundle.
- **Phone to device.** Bluetooth LE Secure Connections with passkey entry. Every
  command requires an encrypted, authenticated link. Bluetooth is off unless the
  owner holds both buttons, and each pairing window gets a new random 6-digit
  passkey that appears only on the monitor. See [BLE provisioning](../../device/ble/).
- **Firmware updates.** Images download over HTTPS and must match the published
  SHA-256 and size. Only owner-approved updates install, and a failing image
  rolls back. See [Firmware updates](../../device/ota/).

## Keeping secrets out of Git

Never commit `.env` files, Clerk secret keys, device keys, firmware built with
`MOCK_*` values, database dumps, signing keystores, or release tokens. Clerk
*publishable* keys are designed to be public. The backend redacts authorization
and device-key headers in its logs, and the firmware never logs secrets,
because device logs are uploaded.
