---
title: Troubleshooting
description: Fixes for common dashboard, API, and device problems.
---

Most problems come down to one mismatched setting. Find yours below, and if you're still stuck, open an issue on [GitHub](https://github.com/open-aiq). We'll help you sort it out.

## Sign-in loops or API 401

- Add the frontend origin and redirect URLs in Clerk.
- Check `VITE_CLERK_PUBLISHABLE_KEY`.
- Add the same origin to the backend's `CLERK_AUTHORIZED_PARTIES`.
- Owner API calls need `Authorization: Bearer <Clerk session token>`.

## Browser blocks the API

That's CORS. Set `VITE_API_URL` to the backend URL ending in `/api/v1`, and add the exact browser origin (scheme, host and port) to the backend's `CORS_ALLOWED_ORIGINS`.

## The monitor's light is blinking red

That's a fault code. Count the blinks between pauses, then look the number up
in [the status LED's fault codes](../../device/status-led/#fault-codes). It
points you at the part to check.

## No readings yet or device offline

Start with the monitor's light: red blinks are a
[fault code](../../device/status-led/#fault-codes). Then check the serial
logs, Wi-Fi, `DEVID`/`DEVKEY` and `BACKEND_BASE_URL`. The first upload comes shortly after boot, then every ten minutes. Offline means twenty minutes without data, so one missed upload won't flag it.

## Upload returns 401

The backend needs both `X-Device-ID` and `X-Device-Key`. Use the public `dev_…` ID, not the UUID in dashboard URLs. After rotating a key, re-provision the monitor.

## Device is missing from the map

Turn on both public readings and public location, and check the newest complete upload has non-zero coordinates. The map may be cached for up to 60 seconds, and can briefly show older data while it refreshes.

## BLE responses look truncated

Notifications arrive in chunks of up to `MTU - 3` bytes (20 at the default MTU). Buffer until a newline, then parse.

## The app cannot find or pair with the monitor

- It advertises only in pairing mode. Hold both buttons for 3 seconds (or send
  `BTN:PAIR` on the serial console) until the screen shows `PAIRING`. The
  window closes after 5 minutes; start it again anytime.
- Use the 6-digit code on screen now; each pairing session gets a new one.
- After a factory reset, remove the old pairing in iOS **Settings → Bluetooth**
  or **Settings → Accessories**, or in Android's Bluetooth settings.
- Writes before pairing fail with "insufficient authentication". In a generic
  BLE client, pair first.

## A firmware update failed

Don't worry: the device logs (app → device → **Logs**) show each OTA step. If
the download or checksum fails, the current firmware keeps running. If a new
image can't upload within 5 minutes, it rolls back and reports
`failed: rolled back`. Fix the cause, then approve the update again.
