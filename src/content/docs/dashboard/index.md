---
title: Dashboard guide
description: Check readings and manage your devices from the web.
---

Anyone can open `/`, `/map` and `/devices/:id`. Sign in to manage your devices under `/app`.

Pick a device to see its current reading and history. It shows as offline after 20 minutes without a reading, and as no-readings if it's never reported.

History has four timelines:

- `daily`: hourly points, in your local time zone
- `weekly` or `monthly`: daily points
- `yearly`: monthly points

Charts cover AQI, particulates, temperature, humidity and heat index when available. Missing data shows as a gap, not a zero.

In device settings you can rename a monitor, mark it indoor or outdoor, make its readings public, share its location, or delete it. To add a monitor or replace its key, use the [mobile app](./app/). It sends the key to the monitor over Bluetooth, so the secret never has to be copied by hand.

The [mobile app](./app/) has the same views, plus live readings, firmware updates and device logs.
