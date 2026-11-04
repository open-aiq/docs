---
title: Register a device
description: Create hardware credentials and provision them safely.
---

## With the mobile app

1. Sign in to the Open AIQ app with your dashboard account.
2. Hold both buttons on the monitor for 3 seconds (pairing mode), then choose
   **Add monitor**.
3. Pick the monitor and enter the 6-digit code shown on its screen.
4. If the monitor is not registered yet, name it. The app creates the device in
   your account and sends its `device_id` and `device_key` straight to the
   monitor over the encrypted Bluetooth link. The key is never shown.
5. Choose a WiFi network, confirm the location and save. The app waits until
   the first reading arrives.

## From the web dashboard

1. Sign in and choose **Add device**.
2. Give the monitor a recognizable name.
3. Save both returned values: `device_id` begins with `dev_`; `device_key` begins with `sk_`.
4. Provision both values onto the ESP32 with `DEVID:` and `DEVKEY:`, then send `SAVE`.

The device key is shown only in the create response. Treat it as a password: do not paste it into issues, logs, screenshots, docs, or committed files. Firmware stores it in ESP32 flash and sends it in `X-Device-Key` on uploads.

If a key is lost or exposed, rotate it. In the app, **Settings → Rotate device
key** rotates and re-provisions in one step while connected. The old key stops
working immediately, so a monitor that is not updated at the same time gets
`401 Unauthorized` until the new key is provisioned.
