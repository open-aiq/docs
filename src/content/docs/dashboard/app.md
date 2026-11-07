---
title: Mobile app
description: Set up and watch your monitors from your phone.
---

The iOS and Android app uses your dashboard account. It isn't in the stores
yet, so build it from [`open-aiq/app`](https://github.com/open-aiq/app) and run
it on your phone with `make dev:prod`.

## What it does

- **Add a monitor.** Pair with the passkey on its screen, register it if it's
  new, choose Wi-Fi and confirm the location. See
  [Register a device](../register-device/).
- **Online and live views.** Last-hour average and history from the backend,
  plus a live reading every 20 seconds over Bluetooth when you're nearby.
- **Monitor settings.** Everything the dashboard has, plus Wi-Fi, location,
  device details and factory reset. The app is also the only place to replace
  a monitor's key: while connected, it rotates the key and sends the new one
  to the monitor in one step.
- **Your account.** Tap your avatar for your profile, app settings such as
  light or dark mode, and **Sign out**.
- **Firmware updates.** Approve an **Update available** badge and watch it
  download and install. See [Firmware updates](../../device/ota/).
- **Logs.** Warnings, errors and key events from the monitor.

## Bluetooth access

On iOS 18 and later, a system sheet (AccessorySetupKit) lists monitors in
pairing mode, and the app can reach only the one you pick. On older iOS and on
Android, the app scans and asks for Bluetooth permission. Android also needs
location permission to scan.
