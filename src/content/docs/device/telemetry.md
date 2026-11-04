---
title: Telemetry and display
description: Sampling, uploads, payloads, and the OLED screens.
---

The monitor samples both sensors every **20 seconds** and shows the result on
its screen right away. Every **10 minutes** it averages the window, about 30
samples, recomputes AQI from the averaged concentrations, and uploads one
reading. The first upload follows the first complete sample after boot.

```json
{
  "pms_data": { "pm1_0": 5, "pm2_5": 12, "pm10_0": 18, "provider": "pms5003" },
  "aqi": 57,
  "temperature_data": { "temperature": 31.2, "humidity": 64.5, "heat_index": 36.8, "provider": "sht30" },
  "location": { "lat": 24.8607, "lon": 67.0011, "provider": "mobile" }
}
```

The request is `POST {BACKEND_BASE_URL}/data` with `X-Device-ID`,
`X-Device-Key`, and `X-Firmware-Version`. `location` is left out when no
coordinates are set; the app sends the phone's location during setup. An upload
is skipped when Wi-Fi is down (one reconnect is tried first) or the window has
no complete sample, and the next 10-minute tick tries again.

After each successful upload the monitor also sends pending
[log events](../ota/#device-logs) and checks for an
[approved firmware update](../ota/).

## Live readings

Over Bluetooth, the app can request every 20-second sample as it happens
(`LIVE:ON`). These use the same field names, with `null` for a missing sensor.
See [BLE provisioning](../ble/#command-reference).

## Display

The left and right buttons cycle through three screens:

| Screen | Shows |
| --- | --- |
| AQI | AQI value, category, and PM2.5 in µg/m³ |
| Climate | Temperature, humidity, and feels-like (heat index) |
| Status | Wi-Fi state and IP, last upload result and age |

Temporary overlays replace the screen while something is happening:
`PAIRING` with the passkey during Bluetooth pairing, and `Updating NN%` during a
firmware update. Before the first sample the AQI screen shows `warming up...`;
an unprovisioned monitor shows `Hold both btns: pair`.

The AQI category uses the [US EPA bands](../../concepts/aqi/).
