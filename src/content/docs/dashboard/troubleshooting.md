---
title: Troubleshooting
description: Diagnose common dashboard, API, and device issues.
---

## Sign-in loops or API 401

Confirm the frontend origin and redirect URLs exist in Clerk, `VITE_CLERK_PUBLISHABLE_KEY` is correct, and the same origin appears in backend `CLERK_AUTHORIZED_PARTIES`. Owner API calls must carry `Authorization: Bearer <Clerk session token>`.

## Browser blocks the API

Set `VITE_API_URL` to the backend URL ending in `/api/v1`. Add the exact browser origin to backend `CORS_ALLOWED_ORIGINS`; scheme, host, and port must match.

## No readings yet or device offline

Check serial logs, Wi-Fi status, configured `DEVID`/`DEVKEY`, and `BACKEND_BASE_URL`. The first upload is attempted shortly after boot. Later uploads occur every ten minutes. The dashboard reports offline after twenty minutes without data.

## Upload returns 401

Both `X-Device-ID` and `X-Device-Key` are required. Re-provision after rotating a key. Do not confuse the internal UUID used in dashboard URLs with the public `dev_…` upload ID.

## Device is missing from the map

Enable both public readings and public location, then ensure the newest complete upload includes non-zero coordinates. Map responses may be cached for up to 60 seconds, with stale responses allowed during revalidation.

## BLE responses look truncated

Notifications are split into chunks of up to `MTU - 3` bytes (20 at the default MTU). Buffer bytes until a newline before interpreting a response.

## The app cannot find or pair with the monitor

- BLE only advertises in pairing mode. Hold both buttons for 3 seconds (or type
  `BTN:PAIR` on the serial console) and check that the screen shows `PAIRING`.
  The window closes after 5 minutes.
- Enter the 6-digit code shown on the monitor. A new code is generated every
  time pairing mode starts.
- If pairing keeps failing after a factory reset, remove the old pairing: in
  iOS **Settings → Bluetooth** or **Settings → Accessories**, or in Android's
  Bluetooth settings.
- Writes before pairing fail with "insufficient authentication". Generic BLE
  clients must pair first.

## A firmware update failed

The device logs (app → device → **Logs**) show each OTA step. A failed
download or checksum leaves the current firmware running. A new image that
cannot upload within 5 minutes rolls back automatically and reports
`failed: rolled back`. Approve the update again once the cause is fixed.
