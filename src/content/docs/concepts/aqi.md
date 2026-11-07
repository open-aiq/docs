---
title: AQI and measurements
description: What AQI values, colors, and units mean, and how they're averaged.
---

Open AIQ shows the US EPA Air Quality Index (AQI) as a whole number, labelled with these bands:

| AQI | Category |
| --- | --- |
| 0–50 | Good |
| 51–100 | Moderate |
| 101–150 | Unhealthy for Sensitive Groups |
| 151–200 | Unhealthy |
| 201–300 | Very Unhealthy |
| 301+ | Hazardous |

Every color comes with its category label. Particulates (PM1.0, PM2.5, PM10: particles up to 1, 2.5, and 10 micrometres across) are in `µg/m³`. Temperature and heat index are in Celsius; humidity is percent relative humidity.

The firmware computes US EPA sub-indexes for PM2.5 and PM10 and reports the higher. For each 10-minute upload it averages concentrations, then recomputes AQI, because AQI isn't linear and averaging AQI values would give a different result. The backend's current view averages the last hour of stored readings; historical views group records by the requested timeline.

Accuracy depends on consumer-grade sensors, placement, airflow, humidity, calibration, and local conditions. Open AIQ isn't a certified regulatory monitor, so don't rely on it alone for medical or emergency decisions.
