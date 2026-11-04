---
title: Hardware and pin map
description: Supported monitor parts, wiring, and flash layout.
---

The reference monitor uses:

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

The OLED and SHT30 share one I²C bus at 400 kHz. Power both at 3.3 V and make
sure the bus has pull-ups. The PMS5003 normally needs 5 V power and runs at
9600 baud; check its UART logic levels. The buttons use the chip's internal
pull-ups and connect to ground.

At boot the firmware looks for the SHT30 at `0x44` or `0x45` and the OLED at
`0x3C` or `0x3D`. A missing part is logged and the rest of the monitor keeps
working. The OLED controller can't be detected from its address, so pick it at
build time (`OLED_CONTROLLER=sh1106` or `ssd1306`), or download the matching
release image.

`src/board.rs` in the device repository is the source of truth for pins.

## Buttons

| Action | Effect |
| --- | --- |
| Left / Right | Cycle the AQI, climate, and status screens |
| Hold both for 3 s | Start Bluetooth pairing mode for 5 minutes |

## Flash layout

`partitions.csv` holds two 1.94 MB app slots (`ota_0`, `ota_1`) for
[over-the-air updates](../ota/) with rollback, and fits any ESP32-S3 module with
4 MB of flash or more. Provisioning lives in `nvs` and survives updates.
