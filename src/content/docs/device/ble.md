---
title: BLE provisioning protocol
description: Pair with the ESP32-S3 monitor and provision it through its secured Nordic UART Service.
---

The Open AIQ mobile app (`app/`) implements this protocol end to end: pairing,
registration, WiFi, location, live readings and settings. Generic Nordic UART
clients still work, but they must complete passkey pairing first.

:::note[Firmware]
This page describes the Rust ESP32-S3 firmware on `main`. The earlier Arduino
firmware had no pairing security, and the mobile app doesn't support it.
:::

## Pairing mode

BLE is off by default. Hold both buttons for 3 seconds to start advertising for
5 minutes. On a development board without buttons, type `BTN:PAIR` in the
serial monitor instead. The monitor advertises as `AirMonitor-XXXX` and its
screen shows `PAIRING`.

The RX and TX characteristics require an encrypted, MITM-authenticated link
(LE Secure Connections, passkey entry):

- **Passkey.** When a phone starts pairing, the monitor shows a random 6-digit
  passkey on its screen and prints it to the serial log. Enter it on the phone.
  The passkey changes every time pairing mode starts and is never uploaded.
- **Bonds.** Bonded phones reconnect without a passkey, but still need pairing
  mode to find the monitor. `CLEAR` removes all bonds.
- **Window.** While connected, the window stays open until 10 minutes without
  commands. After a disconnect, advertising continues for 60 seconds, then
  stops.

On iOS 18 and later the app uses **AccessorySetupKit**: a system sheet lists
monitors in pairing mode, and the app gets access to the chosen monitor only.
There is no general Bluetooth permission prompt. Older iOS versions and Android
use a normal Bluetooth scan.

## Service

| Purpose | UUID |
| --- | --- |
| Service | `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` |
| RX, client → ESP32 (write with response) | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` |
| TX, ESP32 → client (notify) | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` |

Enable TX notifications and terminate every command with `\n`; CRLF is accepted.
Incoming command buffering is capped at 512 bytes. Replies are newline-terminated
lines split into notifications of up to `MTU - 3` bytes. The monitor requests
MTU 247 and falls back to 20-byte chunks. Concatenate notification bytes and
interpret a line only when `\n` arrives.

## Provisioning

```text
INFO                      -> is the monitor registered (DEVID, DEVKEY_SET)?
DEVID:dev_...             -> only when registering (see Register a device)
DEVKEY:sk_...
SCAN                      -> nearby WiFi networks
SSID:Your network
PASS:Your password
LAT:24.8607
LON:67.0011
SAVE                      -> persists and joins WiFi
```

Setters change memory only until `SAVE`. Values may contain colons; secrets are
never echoed. `SAVE` emits `SAVE_BEGIN`, `WIFI_CONNECTING`, then `SAVE_OK` and
`IP:<ip>`, or `SAVE_FAILED:WIFI` / `SAVE_FAILED:STORAGE`, and finally
`SAVE_END`. Credentials are stored even when WiFi fails.

## Command reference

| Command | Reply |
| --- | --- |
| `PING` | `PONG` |
| `STATUS` | `WiFi: connected IP: <ip>` |
| `INFO` | `INFO_BEGIN`, `FW:`, `MAC:`, `DEVID:`, `DEVKEY_SET:0/1`, `WIFI:connected/disconnected`, `SSID:`, `IP:`, `LAST_UPLOAD:<http>,<secs ago>` or `LAST_UPLOAD:none`, `INFO_END` |
| `SCAN` | `SCAN_BEGIN`, `NET:<rssi>,<open/secured>,<ssid>` (strongest first, at most 15), `SCAN_END` |
| `LOAD` | `LOAD_BEGIN`, `SSID:`, `PASS_SET:0/1`, `LAT:`, `LON:`, `DEVID:`, `DEVKEY_SET:0/1`, `LOAD_END` |
| `READ` | `READING:{json}`, or `ERROR:NO_READING` before the first sample |
| `LIVE:ON` / `LIVE:OFF` | `OK: live on/off`; while on, a `READING:{json}` line follows every 20-second sample |
| `OTA:CHECK` | `OK: ota check`; checks for an owner-approved firmware update now |
| `CLEAR` | `CLEARED all stored config`; erases provisioning and BLE bonds |

Live readings use the upload payload's field names, with `null` for a missing
sensor:

```json
{"pm1_0":3,"pm2_5":12,"pm10_0":18,"aqi":57,"temperature":24.5,"humidity":40.0,"heat_index":24.9,"uptime_ms":123456}
```

Unknown commands are echoed as `echo: <command>`. Errors start with `ERROR:`.
