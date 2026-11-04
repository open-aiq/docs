---
title: Firmware updates and logs
description: Owner-approved over-the-air updates with rollback, and the device log.
---

## Over-the-air updates

A monitor installs new firmware only after its owner approves it.

1. A firmware release is published to the backend with its version, HTTPS
   download URL, SHA-256, and size.
2. The backend compares it with the version each monitor reports. The app then
   shows **Update available** for older monitors.
3. The owner approves the update in the app, which creates an update job.
4. After its next upload, or right away when the app sends `OTA:CHECK`, the
   monitor calls `GET /device/ota` and gets the job.
5. It streams the image over HTTPS into the inactive app slot, checking the size
   and SHA-256, and reports progress every 10%. The screen shows `Updating NN%`,
   and sampling and Bluetooth pause.
6. It switches slots, reports `installing`, and reboots.
7. The new firmware is on probation until its first successful upload. Then it
   marks itself good and reports `succeeded`.

If the download or checksum fails, the current firmware keeps running and the
job reports `failed`. If the new firmware crashes, or can't upload within 5
minutes, the bootloader switches back to the previous version. That version
then reports `failed: rolled back to <version>`. The owner can cancel an
approved job until the download starts.

A job moves through `approved`, `downloading`, `installing`, then `succeeded`
or `failed`, or ends as `cancelled`. The app shows the status and download
progress.

## Device logs

The monitor keeps the last 64 important events in memory and uploads them in
batches of up to 50, after each successful upload and once Wi-Fi is up after
boot. Owners read them in the app under **Logs**.

Logged events include:

- boot, with the reset reason and a boot counter
- Wi-Fi connects and failures
- failed uploads
- Bluetooth pairing and provisioning
- every update step

All warnings and errors are logged as well.

```json
{"entries":[{"level":"warn","tag":"wifi","message":"reconnect failed: ...","uptime_ms":183000,"boot_count":12,"ts":1793700000}],"dropped":0}
```

`ts` is Unix time, left out until the clock has synced. `dropped` counts entries
lost to a full buffer. The backend accepts up to 20 log uploads per monitor per
hour. Log messages never contain secrets.
