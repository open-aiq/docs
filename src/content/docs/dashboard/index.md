---
title: Dashboard guide
description: Check readings and manage your devices from the web.
---

Anyone can open `/`, `/map`, and `/devices/:id`. Sign in to manage your own devices under `/app`.

Once signed in, you'll see the devices owned by your Clerk account. Pick one for its current reading and history. A device shows as offline after 20 minutes without a reading; one that has never reported shows a no-readings state.

History has four timelines: `daily` (hourly points), `weekly` or `monthly` (daily points), and `yearly` (monthly points). Hourly times use your local time zone. Missing data appears as a gap, not a zero. Charts cover AQI, particulates, temperature, humidity, and heat index when available.

The [mobile app](./app/) has the same views, plus live readings, firmware updates, and device logs.

In device settings you can rename a monitor, mark it indoor or outdoor, make its readings public, share its location, rotate its upload key, or delete it. Rotating the key disables the old one immediately, so put the new key on the monitor right away.
