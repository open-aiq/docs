---
title: Quick start
description: Explore, run or build Open AIQ.
---

## Explore the product

Visit [open-airiq.web.app](https://open-airiq.web.app) to browse the
community map, or sign in to manage your monitors.

## Run the software locally

Clone what you need from [Open AIQ on GitHub](https://github.com/open-aiq).
`make help` lists each repository's commands.

1. **Backend:** copy `.env.example` to `.env` and fill it in, then run
   `make init`, `make db:up` and `make dev`.
2. **Dashboard:** copy `.env.example`, point `VITE_API_URL` at the backend's
   `/api/v1` URL, then run `make init` and `make dev`.
3. **Mobile app:** with a phone connected, run `make init` and `make dev`
   (uses your local backend).

All three need the same Clerk instance. Add the dashboard's origin (scheme,
host and port) to the backend's `CLERK_AUTHORIZED_PARTIES` and
`CORS_ALLOWED_ORIGINS`. More in [contributor setup](../contributing/).

## Bring up a monitor

1. Build the [reference hardware](../device/hardware/): an ESP32-S3 board,
   PMS5003, SHT30, a 128×64 OLED, and two buttons.
2. Flash it once over USB with the `-full.bin` image from the latest
   [firmware release](../releases/), or build [from source](../device/firmware/)
   with `make flash`.
3. In the mobile app, choose **Add monitor**, hold both buttons for 3 seconds,
   and enter the 6-digit code on the screen. The app registers it, sends your
   Wi-Fi and location, and waits for the first reading.

You'll need the app for this step. Adding monitors and replacing their keys
only happens there, so the key goes straight to the monitor and never needs
copying.

Stuck? Check [troubleshooting](../dashboard/troubleshooting/) or ask on
[GitHub](https://github.com/open-aiq). We're happy to help.
