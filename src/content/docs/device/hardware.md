---
title: Hardware and pin map
description: Parts, wiring and flash layout.
---

You'll need:

- an ESP32-S3 board with at least 4 MB of flash
- a Plantower **PMS5003** particulate sensor
- a Sensirion **SHT30** temperature and humidity sensor
- a 128×64 I²C **OLED**, with either an SH1106 (default) or SSD1306 controller
- two push buttons

| Device | Signal | ESP32-S3 GPIO |
| --- | --- | --- |
| OLED + SHT30 | SDA | 5 |
| OLED + SHT30 | SCL | 4 |
| PMS5003 | sensor TX → ESP RX | 17 |
| PMS5003 | sensor RX ← ESP TX | 18 |
| Right button | active-low | 15 |
| Left button | active-low | 6 |

This is the map for the Proto2 carrier board. If you wired a breadboard before
it, yours probably uses SDA 8, SCL 9, sensor TX 18, sensor RX 17 and buttons 4
(right) and 5 (left). Rewire it, or keep using firmware from before the change.

- **I²C:** the OLED and SHT30 share one 400 kHz bus at 3.3 V. It needs pull-up
  resistors.
- **PMS5003:** usually 5 V power, UART at 9600 baud. Check its UART logic levels
  before wiring it to the ESP32-S3.
- **Buttons:** wire to ground; the chip's internal pull-ups do the rest.

At boot, the firmware looks for the SHT30 at `0x44` or `0x45` and the OLED at
`0x3C` or `0x3D`. A missing part is logged and the rest keeps working.
The OLED controller can't be detected, so choose it at build time
(`OLED_CONTROLLER=sh1106` or `ssd1306`) or grab the matching release image.

`src/board.rs` in the device repository is the source of truth for pins. The
board itself, with schematic, Gerbers and BOM, is in
[open-aiq/hardware](https://github.com/open-aiq/hardware). Stuck on wiring?
Ask us in a [GitHub issue](https://github.com/open-aiq/device/issues).

## Buttons

| Action | Effect |
| --- | --- |
| Left / Right | Cycle screens:<br />AQI<br />Readings<br />Network |
| Hold both for 3 s | Start Bluetooth pairing mode for 5 minutes |

## Flash layout

`partitions.csv` holds two 1.94 MB app slots (`ota_0`, `ota_1`), which enable
[over-the-air updates](../ota/) with rollback. It fits any ESP32-S3 module with
4 MB of flash or more. Provisioning settings live in `nvs` and survive updates.
