---
title: Hardware and pin map
description: Supported monitor parts, wiring, and ESP32 constraints.
---

The reference monitor uses an ESP32 DOIT DevKit v1, Plantower PMS5003, DHT22, 16×2 I²C LCD with a PCF8574 backpack at `0x3F`, and four push buttons.

| Function | GPIO | Notes |
| --- | --- | --- |
| LCD SDA / SCL | 21 / 22 | I²C |
| PMS5003 RX / TX | 16 / 17 | `Serial2`, 9600 baud |
| DHT22 data | 14 | Temperature and humidity |
| Right button | 34 | Falling edge; external pull-up required |
| Left button | 35 | Falling edge; external pull-up required |
| Settings button | 36 | Disabled |
| Boot button | 39 | Disabled |

GPIO 34, 35, 36, and 39 are input-only and have no internal pull-ups. GPIO 36/39 are disabled because an ESP32 RTC-domain erratum can trigger phantom interrupts during Wi-Fi modem-sleep wake. Rewire those buttons to non-RTC pins before enabling them in firmware.

BLE plus Wi-Fi and TLS exceeds the default application partition, so PlatformIO uses `huge_app.csv`: a 3 MB single-app layout without OTA updates.
