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

In device settings you can rename a monitor, mark it indoor or outdoor, make its readings public, share its location, copy its device ID, or delete it. To add a monitor or replace its key, use the [mobile app](./app/). It sends the key to the monitor over Bluetooth, so the secret never has to be copied by hand.

The [mobile app](./app/) has the same views, plus live readings, firmware updates and device logs.

## Your account

Open your avatar and pick **Manage account**. There you can:

- **Change your username.**
- **See how you sign in**: your email addresses, connected Google or GitHub accounts, and your password. You can add, remove or switch any of them, as long as at least one way to sign in remains.
- **Delete your account.** This removes every monitor you own, with its readings, logs and update history, then your sign-in. It can't be undone, so we ask you to type `farewell` first. If you only want a break, signing out keeps everything.

The [mobile app](./app/) has the same page under **Settings**, then **Manage account**.
