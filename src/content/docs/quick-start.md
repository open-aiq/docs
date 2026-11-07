---
title: Quick start
description: Explore, run or build Open AIQ.
---

## Explore the product

Open the dashboard at [open-airiq.web.app](https://open-airiq.web.app) to
browse the community map or sign in to manage your monitors. Only monitors with
public readings appear, and only those that also share location show on the map.

## Run the software locally

Clone what you need from [Open AIQ on GitHub](https://github.com/open-aiq).
`make help` lists each repository's commands.

1. **Backend:** copy `.env.example` to `.env` and fill it in, then run
   `make init`, `make db:up` and `make dev`.
2. **Dashboard:** copy `.env.example`, point `VITE_API_URL` at the backend's
   `/api/v1` URL, then run `make init` and `make dev`.
3. **Mobile app:** with a phone connected, run `make init` and `make dev`. It
   uses your local backend.

All three must use the same Clerk instance, and the dashboard's origin
(scheme, host and port) must be in the backend's `CLERK_AUTHORIZED_PARTIES` and
`CORS_ALLOWED_ORIGINS`. See [contributor setup](../contributing/) for details.

## Bring up a monitor

1. Build the [reference hardware](../device/hardware/): an ESP32-S3 board,
   PMS5003, SHT30, a 128×64 OLED, and two buttons.
2. Flash it once over USB with the `-full.bin` image from the latest
   [firmware release](../releases/), or build [from source](../device/firmware/)
   with `make flash`.
3. In the mobile app, choose **Add monitor**, hold both buttons for 3 seconds,
   and enter the 6-digit code on the screen. The app registers the monitor,
   sends your Wi-Fi and location, and waits for the first reading.

No phone? [Register in the dashboard](../dashboard/register-device/), then
provision with any Nordic UART BLE client after passkey pairing.
