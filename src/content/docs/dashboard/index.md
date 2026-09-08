---
title: Dashboard guide
description: View readings and manage your Open AIQ devices.
---

The dashboard has public routes at `/`, `/map`, and `/devices/:id`. Signed-in device management lives below `/app`.

After signing in, the device list is scoped to your Clerk user. Select a device to view its current status and historical series. A device is considered offline when the backend has not received a reading for 20 minutes; a device that has never reported returns a no-readings state.

Historical views request one of four timelines: `daily`, `weekly`, `monthly`, or `yearly`. Metrics include AQI, particulate concentrations, temperature, humidity, and heat index when available.

Device settings let you rename a monitor, classify it as indoor/outdoor, control public visibility and location sharing, rotate its upload key, or delete it. Key rotation invalidates the old key immediately, so provision the new value onto the monitor at once.
