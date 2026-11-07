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
| OLED + SHT30 | SDA | 8 |
| OLED + SHT30 | SCL | 9 |
| PMS5003 | sensor TX → ESP RX | 18 |
| PMS5003 | sensor RX ← ESP TX | 17 |
| Right button | active-low | 4 |
| Left button | active-low | 5 |

- **I²C:** the OLED and SHT30 share one 400 kHz bus at 3.3 V. It needs pull-up
  resistors.
- **PMS5003:** usually 5 V power, UART at 9600 baud. Check its UART logic levels
  before wiring it to the ESP32-S3.
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
| Left / Right | Cycle screens:<br />AQI<br />Climate<br />Status |
| Hold both for 3 s | Start Bluetooth pairing mode for 5 minutes |

## Flash layout

`partitions.csv` holds two 1.94 MB app slots (`ota_0`, `ota_1`), which enable
[over-the-air updates](../ota/) with rollback. It fits any ESP32-S3 module with
4 MB of flash or more. Provisioning settings live in `nvs` and survive updates.
