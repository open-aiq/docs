---
title: Quick start
description: The shortest paths to explore, run, or build Open AIQ.
---

## Explore the product

Open the dashboard at [open-airiq.web.app](https://open-airiq.web.app) to browse
the community map, or sign in to manage your monitors. Public device pages show
only monitors whose owners made their readings public. The map also requires
location sharing.

## Run the software locally

Clone the repositories you need from the
[Open AIQ GitHub organization](https://github.com/open-aiq). Each one runs
`make help` to list its commands.

1. **Backend:** copy `.env.example` to `.env` and fill it in, then
   `make init`, `make db:up` and `make dev`.
2. **Dashboard:** copy `.env.example`, point `VITE_API_URL` at the backend's
   `/api/v1` URL, then `make init` and `make dev`.
3. **Mobile app:** with a phone connected, `make init` and `make dev`. It
   targets the backend running on your machine.

Use the same Clerk instance in all three, and list the dashboard's origin in
the backend's `CLERK_AUTHORIZED_PARTIES` and `CORS_ALLOWED_ORIGINS`. See
[contributor setup](../contributing/) for details.

## Bring up a monitor

1. Build the [reference hardware](../device/hardware/): an ESP32-S3 board,
   PMS5003, SHT30, a 128×64 OLED, and two buttons.
2. Flash it once over USB, either the `-full.bin` image from the latest
   [firmware release](../releases/) or [from source](../device/firmware/) with
   `make flash`.
3. In the mobile app, choose **Add monitor**, hold both buttons for 3 seconds,
   and enter the 6-digit code shown on the screen. The app registers the monitor,
   sends Wi-Fi and location, and waits for the first reading.

No phone? You can [register in the dashboard](../dashboard/register-device/)
and provision with any Nordic UART BLE client after passkey pairing.
