---
title: The status LED
description: What the monitor's light is telling you, and how to read its fault codes.
---

The monitor has one small RGB light. It tells you what the board is doing when
you can't see the serial log, or when the screen itself is the problem. When
all is well, its slow blink also carries the color of the air.

We keep it dim on purpose, at about 10% brightness, so it's fine next to a
bed.

:::note
The light is the onboard LED of the ESP32-S3-DevKitC-1, or D1 on our SMT
board. DevKitC-1 v1.0 and the SMT board use GPIO 48; v1.1 moved it to GPIO 38.
The firmware sends the same signal to both, so it lights on either. The monitor
works the same without it.
:::

## What the patterns mean

Only one pattern shows at a time. If two apply, the one higher in this table
wins.

| Pattern | Meaning |
| --- | --- |
| White fade-in | Starting up |
| Amber, slow breathing | Downloading or installing a firmware update |
| Two green or two red flashes | Pairing worked, or didn't |
| Steady blue | A phone is connected, or the passkey is on screen |
| Blue, slow breathing | Pairing mode is open, waiting for a phone |
| Red blinks, then a pause | Something needs attention. Count the blinks (below) |
| Yellow, 1 s on, 1 s off | Not set up yet |
| Dim white, slow breathing | The particle sensor is warming up |
| Dim green, with a brighter tick | The particle sensor is sampling. Each tick is a reading arriving |
| Dark, with a tiny blink every 5 s | Resting between samples. All is well |

The last three follow the particle sensor's
[five-minute cycle](../particle-sensor/), so you'll see them take turns.

## The resting blink shows the air

While the monitor rests, its blink takes the color of the current
[AQI band](../../concepts/aqi/). It's green until the first reading arrives.

| AQI | Band | Blink |
| --- | --- | --- |
| 0–50 | Good | Green |
| 51–100 | Moderate | Yellow |
| 101–150 | Slightly Unhealthy | Orange |
| 151–200 | Unhealthy | Red |
| 201–300 | Very Unhealthy | Purple |
| 301+ | Hazardous | Pink |

These are the same band colors as the app and dashboard, with most of the
white taken out. Pastels look nearly white on a dim LED.

A red resting blink is one short flash every 5 seconds. A fault is brighter and
comes as a counted group, so the two don't look alike.

## Fault codes

Count the red blinks between pauses. If there's more than one fault, you'll
see the lowest number first; fix it and the next one shows.

| Blinks | What's wrong | Where to look |
| --- | --- | --- |
| 1 | The particle sensor is silent: a whole burst with no readings | Its cable, 5 V power, and the TX and RX wires |
| 2 | The SHT30 is missing, or its last read failed | The I²C wiring and pull-up resistors |
| 3 | The OLED wasn't found at startup | The OLED's cable. Restart the monitor after fixing it |
| 4 | Wi-Fi is set up but not connected | Router range, or the saved network name and password |
| 5 | The backend didn't accept the last upload | The device logs in the app, or the `upload failed http=` line on serial |
| 6 | A new firmware update is running but not confirmed yet | Nothing to do: it clears after the first good upload |

If the light is dim green but never ticks, the particle sensor is powered but
its readings aren't arriving. Check the sensor's TX wire.

Still stuck? [Troubleshooting](../../dashboard/troubleshooting/) has more, and
we're happy to help in a
[GitHub issue](https://github.com/open-aiq/device/issues).
