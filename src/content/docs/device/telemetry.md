---
title: Telemetry and display
description: Sampling, uploads and the OLED screens.
---

The monitor samples both sensors every **20 seconds** and shows the result
right away. Every **10 minutes** it averages the window (about 30 samples),
recomputes AQI from those averages, and uploads one reading. The first upload
follows the first complete sample after boot.

```json
{
  "pms_data": { "pm1_0": 5, "pm2_5": 12, "pm10_0": 18, "provider": "pms5003" },
  "aqi": 57,
  "temperature_data": { "temperature": 31.2, "humidity": 64.5, "heat_index": 36.8, "provider": "sht30" },
  "location": { "lat": 24.8607, "lon": 67.0011, "provider": "mobile" }
}
```

- The request is `POST {BACKEND_BASE_URL}/data` with `X-Device-ID`,
  `X-Device-Key`, and `X-Firmware-Version`.
- `location` is omitted when no coordinates are set; the app sends the phone's
  location during setup.
- If Wi-Fi is still down after one reconnect attempt, or the window has no
  complete sample, the monitor skips that upload and tries again next tick.
- After each successful upload, the monitor sends pending
  [log events](../ota/#device-logs) and checks for an
  [approved firmware update](../ota/).

## Live readings

Over Bluetooth, `LIVE:ON` streams every 20-second sample, using the same field
names and `null` for a missing sensor. See
[BLE provisioning](../ble/#command-reference).

## Display

The buttons cycle three screens:

| Screen | Shows |
| --- | --- |
| AQI | AQI value<br />Category<br />PM2.5 in µg/m³ |
| Climate | Temperature<br />Humidity<br />Feels-like (heat index) |
| Status | Wi-Fi state and IP<br />Last upload result and age |

You may also see:

- `PAIRING` with the passkey, during Bluetooth pairing
- `Updating NN%`, during a firmware update
- `warming up...` on the AQI screen, before the first sample
- `Hold both btns: pair`, on a monitor that isn't set up yet

The AQI category uses the [US EPA bands](../../concepts/aqi/).
