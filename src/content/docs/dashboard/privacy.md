---
title: Privacy and public map
description: Understand public readings and exact-location consent.
---

New and migrated devices default to private location. Two independent settings control exposure:

| Setting | Effect |
| --- | --- |
| Public device (`is_public`) | Allows the public device page and public reading endpoints |
| Public location (`is_location_public`) | Allows exact latest coordinates to appear on the community map |

Location can be shared only while the device itself is public. Making a device private automatically disables location sharing. The map includes a device only when **both** settings are enabled and a complete latest sample has coordinates.

Coordinates come from the latest telemetry sample and are exact, not blurred. Before opting in, consider whether a home, workplace, school, or other sensitive location can be inferred. Turning sharing off removes eligibility for subsequent map responses, but cannot retract data already cached or copied by third parties.

Telemetry omits the entire `location` object when latitude and longitude are unset at `0/0`.
