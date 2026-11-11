---
title: Register a device
description: Create your monitor's credentials and put them on it.
---

Registering gives your monitor its own ID and key, so the backend knows which
readings are yours. You do this in the mobile app, because the app can hand
the key straight to the monitor over Bluetooth. The web dashboard shows your
monitors once they're set up, but it can't add them or change their keys.

## With the mobile app

1. Sign in to the Open AIQ app with your dashboard account.
2. Hold both monitor buttons for 3 seconds to enter pairing mode, then choose
   **Add monitor**.
3. Pick the monitor and enter the 6-digit code on its screen.
4. If it's new, name it. The app sends its `device_id` and `device_key` over
   the encrypted Bluetooth link, so you never see the key.
5. Choose a Wi-Fi network, confirm the location and save. The app waits for the
   first reading.

The key never leaves the app and the monitor. The firmware stores it in ESP32
flash and sends it as the `X-Device-Key` header on uploads.

Lost or exposed a key? Rotate it. In the app, **Settings → Replace device key**
rotates and re-provisions in one step while connected. The old key stops
working immediately, so the monitor gets `401 Unauthorized` until it has the
new one.
