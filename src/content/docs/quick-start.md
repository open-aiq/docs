---
title: Quick start
description: Choose the shortest path to explore or develop Open AIQ.
---

## Explore the product

Open the public dashboard at [openaiq.org](https://openaiq.org), browse the community map, or sign in to manage your devices. Public device pages expose only devices opted into public readings; map markers additionally require location-sharing consent.

## Run the software locally

Clone the repositories you need from the [Open AIQ GitHub organization](https://github.com/open-aiq). Each repository has its own dependencies and history.

1. Start PostgreSQL and configure the Go backend from `backend/.env.example`.
2. Run the backend and set the frontend’s `VITE_API_URL` to its `/api/v1` URL.
3. Configure Clerk keys and matching authorized origins in both projects.
4. Run the React dashboard with `npm run dev`.

See [contributor setup](../contributing/) for exact commands.

## Bring up a monitor

Wire the [supported hardware](../device/hardware/), copy `include/secrets.example.h` to the ignored `include/secrets.h`, and build with PlatformIO. Register a device in the dashboard and save the returned key immediately—it is shown only once.

Until the Flutter provisioning workflow is complete, choose one of these development paths:

- Set `MOCK_APP_PROVISIONING=1` for the first boot of an empty flash configuration.
- Use a generic Nordic UART BLE client to send the [provisioning commands](../device/ble/).

Firmware upload changes attached hardware and is intentionally not part of the automatic setup.
