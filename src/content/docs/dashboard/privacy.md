---
title: Privacy and public map
description: What sharing readings and location exposes.
---

New and migrated devices start with location private. Two settings control what others see:

| Setting | Effect |
| --- | --- |
| Public device (`is_public`) | Enables the public device page and public reading endpoints |
| Public location (`is_location_public`) | Shows exact latest coordinates on the community map |

Location can be public only while the device is. Making a device private turns location sharing off. A device appears on the map only when **both** are on and its latest complete sample has coordinates.

Think before you share location. Coordinates are exact, not blurred, so they could reveal a home, workplace or school. Turning sharing off removes the device from future map responses, but we can't recall data others have already cached or copied.

If latitude and longitude are unset (`0/0`), telemetry leaves out the `location` object.
