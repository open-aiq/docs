---
title: Telemetry and display
description: Sampling, uploads and the OLED screens.
---

The monitor reads temperature and humidity every **20 seconds**. The particle
sensor works in short bursts instead: every 5 minutes it wakes, settles for
30 s, and we average every reading from the next 30 s. Then it rests, which
helps it last longer. [The particle sensor](../particle-sensor/) explains why.

Every **10 minutes** the monitor averages the window (two bursts, about 26
particle readings), recomputes AQI from those averages, and uploads one
reading. Uploads go out while the sensor rests, and the first one follows the
first burst, about a minute after boot.

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
names and `null` for a missing sensor. Particle values come from the latest
burst, so they stay the same while the sensor rests. See
[BLE provisioning](../ble/#command-reference).

## Display

The buttons cycle three screens:

| Screen | Shows |
| --- | --- |
| AQI | AQI as a large number<br />Band name and a six-step gauge<br />Feels-like temperature (heat index)<br />Wi-Fi icon, struck through when offline |
| Readings | PM1.0, PM2.5 and PM10 in µg/m³<br />Temperature and humidity |
| Network | Wi-Fi name and signal bars<br />IP address, or `Offline`<br />Last upload, such as `Sent 2m ago`<br />Firmware version |

The screen has one color, so the band shows as a name and a gauge: six boxes,
Good on the left, with the current band filled. The band's color is on
[the status LED](../status-led/) instead. While the particle sensor rests, the
LED blinks once every 5 seconds in that color.

You may also see:

- `Open AIQ` and `starting...`, from power-on until Wi-Fi has had its first
  try. That's usually a few seconds, and longer if the network is out of reach.
- `PAIRING` with the passkey, during Bluetooth pairing
- A percentage over `Updating, keep power`, during a firmware update
- `warming up...` on the AQI screen, before the first burst. If it comes back
  later, the particle sensor sent nothing in its last burst; check its cable.
- `Hold both btns: pair`, on a monitor that isn't set up yet

The band names and colors are the [US EPA bands](../../concepts/aqi/) you see
in the app and dashboard.
