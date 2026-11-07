---
title: Privacy and public map
description: What sharing readings and location exposes.
---

New and migrated devices start with location private. Two settings control what others see:

| Setting | Effect |
| --- | --- |
| Public device (`is_public`) | Allows the public device page and public reading endpoints |
| Public location (`is_location_public`) | Allows exact latest coordinates to appear on the community map |

Location can be public only while the device is public; making a device private turns location sharing off. A device appears on the map only when **both** settings are on and its latest complete sample includes coordinates.

Think before you opt in. Coordinates come from the latest telemetry sample and are exact, not blurred, so they could reveal a home, workplace, school, or other sensitive place. Turning sharing off removes the device from future map responses, but we can't recall data third parties have already cached or copied.

When latitude and longitude are unset at `0/0`, telemetry leaves out the whole `location` object.
