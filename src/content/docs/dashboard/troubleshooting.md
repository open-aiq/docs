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

Notifications are split into chunks of at most 20 bytes. Buffer bytes until a newline before interpreting a response.
