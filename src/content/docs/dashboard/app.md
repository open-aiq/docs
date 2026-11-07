---
title: Mobile app
description: Set up and watch your monitors from your phone.
---

The Open AIQ app for iOS and Android uses your dashboard account. It isn't
released yet; build it from [`open-aiq/app`](https://github.com/open-aiq/app)
and run it on your phone with `make dev:prod`.

## What it does

- **Add a monitor.** Pair with the passkey on the monitor's screen, register it
  if it's new, choose Wi-Fi, and confirm the location. The app waits for the
  first reading. See [Register a device](../register-device/).
- **Online and live views.** Last-hour average and history from the backend,
  plus a live reading every 20 seconds over Bluetooth when you're nearby.
- **Settings.** Everything the dashboard has (name, indoor or outdoor, public
  readings, location sharing, rotate key, delete), plus on-device settings:
  Wi-Fi, location, device details, and factory reset. Rotating the key while
  connected also sends the new key to the monitor.
- **Firmware updates.** Approve an **Update available** badge and watch the
  download and install progress. See [Firmware updates](../../device/ota/).
- **Logs.** Warnings, errors, and key events uploaded by the monitor.

## Bluetooth access

On iOS 18 and later, the app uses AccessorySetupKit: a system sheet lists
monitors in pairing mode, and the app can access only the one you pick. On
older iOS and on Android, the app scans normally and asks for Bluetooth
permission. Android also asks for location permission, which it needs to scan.
