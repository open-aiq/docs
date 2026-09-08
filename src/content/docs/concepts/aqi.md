---
title: AQI and measurements
description: AQI categories, particulate units, and aggregation semantics.
---

Open AIQ presents the US EPA Air Quality Index as a whole number and labels it with these bands:

| AQI | Category |
| --- | --- |
| 0–50 | Good |
| 51–100 | Moderate |
| 101–150 | Unhealthy for Sensitive Groups |
| 151–200 | Unhealthy |
| 201–300 | Very Unhealthy |
| 301+ | Hazardous |

Color is accompanied by a category label so meaning does not depend on color alone. Particulate concentrations (PM1.0, PM2.5, PM10) are expressed in micrograms per cubic metre (`µg/m³`). Temperature is Celsius, humidity is percent relative humidity, and heat index is Celsius.

Firmware computes AQI from particulate measurements. For upload windows it averages concentrations first, then recomputes AQI rather than averaging AQI numbers. The backend current view averages stored readings from the last hour. Historical views bucket records according to the requested timeline.

Consumer sensors, placement, airflow, humidity, calibration, and local conditions all affect results. Do not treat Open AIQ as a certified regulatory monitor or use it as the sole basis for medical or emergency decisions.
