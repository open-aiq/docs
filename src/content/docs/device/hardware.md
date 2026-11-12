---
title: Hardware and pin map
description: Parts, wiring and flash layout.
---

You'll need:

- an ESP32-S3 board with at least 4 MB of flash
- a Plantower **PMS5003** particulate sensor
- a Sensirion **SHT30** temperature and humidity sensor
- a 128×64 I²C **OLED**, with either an SH1106 (default) or SSD1306 controller
- two push buttons, for moving between screens and starting pairing
- optional: an RGB status LED (WS2812). Every ESP32-S3-DevKitC-1 has one on
  board

| Device | Signal | ESP32-S3 GPIO |
| --- | --- | --- |
| OLED + SHT30 | SDA | 5 |
| OLED + SHT30 | SCL | 4 |
| PMS5003 | sensor TX → ESP RX | 17 |
| PMS5003 | sensor RX ← ESP TX | 18 |
| PMS5003 | SET: high runs, low sleeps | 8 |
| PMS5003 | RESET (optional; not driven yet) | 16 |
| Right button | active-low | 15 |
| Left button | active-low | 6 |
| Pair button | active-low (Proto2 only; not read yet) | 7 |
| Status LED | WS2812 data | 48 (devkit v1.0) or 38 (v1.1) |

Don't skip SET. The firmware uses it to
[rest the particle sensor](../particle-sensor/) between samples. Left
unconnected, the sensor runs all the time and wears out sooner.

This is the map for the Proto2 carrier board. If you wired a breadboard before
it, yours probably uses SDA 8, SCL 9, sensor TX 18, sensor RX 17 and buttons 4
(right) and 5 (left). Rewire it, or keep using firmware from before the change.

- **I²C:** the OLED and SHT30 share one 400 kHz bus at 3.3 V. It needs pull-up
  resistors.
- **PMS5003:** 5 V power, UART at 9600 baud. Its data pins use 3.3 V logic, so
  they connect straight to the ESP32-S3.
- **Status LED:** the firmware sends the same signal to GPIO 48 and 38, so the
  devkit's LED lights on either board revision. Leave both pins free.
- **Buttons:** wire to ground; the chip's internal pull-ups do the rest.

At boot, the firmware looks for the SHT30 at `0x44` or `0x45` and the OLED at
`0x3C` or `0x3D`. A missing part is logged and the rest keeps working.
The OLED controller can't be detected, so choose it at build time
(`OLED_CONTROLLER=sh1106` or `ssd1306`) or grab the matching release image.

`src/board.rs` in the device repository is the source of truth for pins. Stuck
on wiring? Ask us in a
[GitHub issue](https://github.com/open-aiq).

## Buttons

| Action | Effect |
| --- | --- |
| Left / Right | Cycle screens:<br />AQI<br />Readings<br />Network |
| Hold both for 3 s | Start Bluetooth pairing mode for 5 minutes |

## Flash layout

`partitions.csv` holds two 1.94 MB app slots (`ota_0`, `ota_1`), which enable
[over-the-air updates](../ota/) with rollback. It fits any ESP32-S3 module with
4 MB of flash or more. Provisioning settings live in `nvs` and survive updates.
