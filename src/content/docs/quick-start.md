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
2. **Dashboard:** run `make init`, then `make review` to see every page with
   mock data. There's no live dev server: the dashboard is tested on its
   deployed domain, so set `VITE_API_URL` and the Clerk key in
   `.env.production` before you `make deploy`.
3. **Mobile app:** with a phone connected, run `make init` and `make dev`
   (uses your local backend).

All three need the same Clerk instance. Add the deployed dashboard's origin
(scheme and host) to the backend's `CLERK_AUTHORIZED_PARTIES` and
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
