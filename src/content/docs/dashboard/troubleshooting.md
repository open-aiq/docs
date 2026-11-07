---
title: Troubleshooting
description: Fixes for common dashboard, API, and device problems.
---

Most setup problems come down to one mismatched setting. Find what you're seeing below.

## Sign-in loops or API 401

Check that the frontend origin and redirect URLs exist in Clerk, that `VITE_CLERK_PUBLISHABLE_KEY` is correct, and that the same origin is in the backend's `CLERK_AUTHORIZED_PARTIES`. Owner API calls need `Authorization: Bearer <Clerk session token>`.

## Browser blocks the API

This is CORS. Set `VITE_API_URL` to the backend URL ending in `/api/v1`, and add the exact browser origin to the backend's `CORS_ALLOWED_ORIGINS`. Scheme, host, and port must all match.

## No readings yet or device offline

Check the serial logs, Wi-Fi status, `DEVID`/`DEVKEY`, and `BACKEND_BASE_URL`. The first upload runs shortly after boot, then every ten minutes. A device shows offline after twenty minutes without data, so one missed upload won't flag it.

## Upload returns 401

The backend needs both `X-Device-ID` and `X-Device-Key`. After rotating a key, re-provision the monitor. The monitor needs the public `dev_…` ID, not the internal UUID in dashboard URLs.

## Device is missing from the map

Turn on both public readings and public location, and make sure the newest complete upload has non-zero coordinates. Map responses may be cached for up to 60 seconds, and a stale response can be served while the cache refreshes.

## BLE responses look truncated

Bluetooth notifications arrive in chunks of up to `MTU - 3` bytes (20 at the default MTU). Buffer bytes until a newline, then read the response.

## The app cannot find or pair with the monitor

- The monitor advertises over BLE only in pairing mode. Hold both buttons for 3
  seconds (or send `BTN:PAIR` on the serial console) and check the screen shows
  `PAIRING`. The window closes after 5 minutes; start it again if needed.
- Enter the 6-digit code on screen now. A new code is generated each time
  pairing mode starts.
- If pairing fails after a factory reset, remove the old pairing in iOS
  **Settings → Bluetooth** or **Settings → Accessories**, or in Android's
  Bluetooth settings.
- Writes before pairing fail with "insufficient authentication". In a generic
  BLE client, pair first.

## A firmware update failed

The device logs (app → device → **Logs**) show each OTA step. If the download
or checksum fails, the current firmware keeps running. If a new image can't
upload within 5 minutes, it rolls back automatically and reports
`failed: rolled back`. Fix the cause, then approve the update again.
