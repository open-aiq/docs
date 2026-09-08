---
title: Telemetry and display
description: Sampling, uploads, payloads, screens, and retry behavior.
---

Sensors are sampled every **20 seconds**. The LCD immediately displays the latest sample. Every **10 minutes**, firmware averages the sampling window (about 30 readings), recomputes AQI from averaged concentrations, and uploads one record. The first upload is attempted shortly after boot.

```json
{
  "pms_data": { "pm1_0": 5, "pm2_5": 12, "pm10_0": 18, "provider": "pms5003" },
  "aqi": 57,
  "temperature_data": { "temperature": 31.2, "humidity": 64.5, "heat_index": 36.8, "provider": "dht22" },
  "location": { "lat": 24.8607, "lon": 67.0011, "provider": "mobile" }
}
```

The request goes to `{BACKEND_BASE_URL}/data` with `X-Device-ID` and `X-Device-Key`. Location is omitted when coordinates are unset. Uploads are skipped when Wi-Fi is down, credentials are missing, or readings are incomplete; the next scheduled tick retries.

## Display

Right and Left cycle through three flicker-free, fixed-width screens:

1. AQI category and PM2.5 concentration
2. Temperature, heat index, and humidity
3. Wi-Fi/IP plus last upload status and age

Settings and Boot buttons are disabled on the reference pinout. The display’s AQI category uses the [US EPA bands](../../concepts/aqi/).
