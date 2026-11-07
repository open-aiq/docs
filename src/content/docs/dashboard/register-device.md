---
title: Register a device
description: Create your monitor's credentials and put them on it.
---

Registering gives your monitor its own ID and key so the backend knows which
readings are yours. Use the mobile app or the web dashboard.

## With the mobile app

1. Sign in to the Open AIQ app with your dashboard account.
2. Hold both buttons on the monitor for 3 seconds to enter pairing mode, then
   choose **Add monitor**.
3. Pick the monitor and enter the 6-digit code on its screen.
4. If it isn't registered yet, name it. The app creates the device and sends its
   `device_id` and `device_key` to the monitor over the encrypted Bluetooth
   link. You never see the key.
5. Choose a WiFi network, confirm the location, and save. The app waits for the
   first reading.

## From the web dashboard

1. Sign in and choose **Add device**.
2. Name the monitor.
3. Save both values you get back: `device_id` begins with `dev_`, and `device_key` begins with `sk_`.
4. Provision both values onto the ESP32 with `DEVID:` and `DEVKEY:`, then send `SAVE`.

The device key is shown only once, in the create response. Treat it like a password: keep it out of issues, logs, screenshots, docs, and committed files. The firmware stores it in ESP32 flash and sends it in the `X-Device-Key` header on uploads.

If a key is lost or exposed, rotate it. In the app, **Settings → Rotate device
key** rotates and re-provisions the monitor in one step while connected. The
old key stops working immediately, so a monitor without the new key gets
`401 Unauthorized` until you provision it.
