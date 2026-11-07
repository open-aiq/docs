---
title: AQI and measurements
description: What AQI values, colors, and units mean, and how they're averaged.
---

Open AIQ shows the US EPA Air Quality Index (AQI) as a whole number, with these bands:

| AQI | Category |
| --- | --- |
| 0–50 | Good |
| 51–100 | Moderate |
| 101–150 | Unhealthy for Sensitive Groups |
| 151–200 | Unhealthy |
| 201–300 | Very Unhealthy |
| 301+ | Hazardous |

Every color comes with its category label.

## Units

| Measurement | Unit |
| --- | --- |
| PM1.0 (particles up to 1 µm across)<br />PM2.5 (up to 2.5 µm)<br />PM10 (up to 10 µm) | `µg/m³` |
| Temperature<br />Heat index | Celsius |
| Humidity | % relative humidity |

## How it's averaged

- The firmware computes US EPA sub-indexes for PM2.5 and PM10 and reports the higher one.
- For each 10-minute upload, it averages concentrations, then recomputes AQI. AQI isn't linear, so averaging AQI values would give a different answer.
- The backend's current view averages the last hour of stored readings. Historical views group readings by the timeline you ask for.

## Accuracy

Readings depend on the consumer-grade sensors, placement, airflow, humidity, calibration, and local conditions. Open AIQ isn't a certified regulatory monitor, so please don't rely on it alone for medical or emergency decisions.
