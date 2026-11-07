---
title: Firmware updates and logs
description: Owner-approved updates with rollback, and device logs.
---

## Over-the-air updates

Nothing installs until the owner approves it:

1. A release is published to the backend with version, HTTPS download URL,
   SHA-256, and size.
2. The app shows **Update available** for monitors reporting an older version.
3. The owner approves it, creating an update job.
4. After its next upload, or on `OTA:CHECK`, the monitor fetches the job from
   `GET /device/ota`.
5. It streams the image over HTTPS into the inactive slot, checking size and
   SHA-256 and reporting progress every 10%. Sampling and Bluetooth pause while
   the screen shows `Updating NN%`.
6. It switches slots, reports `installing`, and reboots.
7. After its first successful upload, the new firmware marks itself good and
   reports `succeeded`.

If something fails, the monitor stays safe:

- A failed download or checksum leaves the current firmware running and reports
  `failed`.
- If the new firmware crashes or can't upload within 5 minutes, the bootloader
  rolls back and reports `failed: rolled back to <version>`.

You can cancel an approved job until the download starts.

Job states: `approved`, `downloading`, `installing`, then `succeeded`,
`failed`, or `cancelled`.

## Device logs

The monitor keeps its last 64 important events and uploads them in batches of
up to 50, after each successful upload and once Wi-Fi is up after boot. Owners
read them in the app under **Logs**. Events include:

- boot, with the reset reason and a boot counter
- Wi-Fi connects and failures
- failed uploads
- Bluetooth pairing and provisioning
- every update step
- all warnings and errors

```json
{"entries":[{"level":"warn","tag":"wifi","message":"reconnect failed: ...","uptime_ms":183000,"boot_count":12,"ts":1793700000}],"dropped":0}
```

`ts` is Unix time, omitted until the clock syncs. `dropped` counts entries lost
to a full buffer. Limit: 20 log uploads per monitor per hour. Logs never
contain secrets.
