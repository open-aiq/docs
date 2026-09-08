---
title: Register a device
description: Create hardware credentials and provision them safely.
---

1. Sign in and choose **Add device**.
2. Give the monitor a recognizable name.
3. Save both returned values: `device_id` begins with `dev_`; `device_key` begins with `sk_`.
4. Provision both values onto the ESP32 with `DEVID:` and `DEVKEY:`, then send `SAVE`.

The device key is shown only in the create response. Treat it as a password: do not paste it into issues, logs, screenshots, docs, or committed files. Firmware stores it in ESP32 flash and sends it in `X-Device-Key` on uploads.

If a key is lost or exposed, rotate it from device settings. The old key stops working immediately. If the physical monitor cannot be updated at the same time, its uploads will receive `401 Unauthorized` until the new key is provisioned.
