---
title: Mobile app
description: Add monitors over Bluetooth and manage them from your phone.
---

The Open AIQ app for iOS and Android uses the same account as the web dashboard.
It isn't in the app stores or released yet; build it from
[`open-aiq/app`](https://github.com/open-aiq/app) and run it on your phone
with `make dev:prod`.

## What it does

- **Add a monitor.** Pair with the passkey on the monitor's screen, register it
  in your account if it's new, choose a Wi-Fi network, and confirm the location.
  The app waits for the first reading. See
  [Register a device](../register-device/).
- **Online and live views.** The last-hour average and history chart from the
  backend, plus a live reading every 20 seconds over Bluetooth when you're
  nearby.
- **Settings.** Everything the dashboard has: name, indoor or outdoor, public
  readings, location sharing, rotate key, delete. Plus settings stored on the
  monitor: Wi-Fi, location, device details, and factory reset. Rotating the key
  while connected sends the new key to the monitor in the same step.
- **Firmware updates.** An **Update available** badge, approval, and progress
  while the monitor downloads and installs. See
  [Firmware updates](../../device/ota/).
- **Logs.** Warnings, errors, and important events the monitor has uploaded.

## Bluetooth access

On iOS 18 and later the app uses AccessorySetupKit: a system sheet lists
monitors in pairing mode, and the app gets access only to the one you pick.
Older iOS versions and Android use a normal Bluetooth scan and ask for Bluetooth
permission (Android also asks for location to scan).
