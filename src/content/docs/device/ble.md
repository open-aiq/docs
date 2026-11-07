---
title: BLE provisioning protocol
description: Pair with the monitor and set it up over secured Nordic UART.
---

The Open AIQ app (`app/`) implements this protocol. Generic Nordic UART
clients work too, after passkey pairing.

:::note[Firmware]
This covers the Rust ESP32-S3 firmware on `main`. The app doesn't support the
earlier Arduino firmware, which had no pairing security.
:::

## Pairing mode

BLE is off by default. Hold both buttons for 3 s (or send `BTN:PAIR` over
serial) to advertise as `AirMonitor-XXXX` for 5 minutes; the screen shows
`PAIRING`.

RX and TX require an encrypted, MITM-authenticated link (LE Secure
Connections, passkey entry):

- **Passkey.** A random 6-digit passkey appears on screen and in the serial
  log; enter it on the phone. It's new each pairing session and never uploaded.
- **Bonds.** Bonded phones reconnect without a passkey but still need pairing
  mode to find the monitor. `CLEAR` removes all bonds.
- **Window.** Stays open while connected until 10 minutes without commands.
  After a disconnect, advertising continues for 60 seconds.

On iOS 18+, the app uses **AccessorySetupKit**: a system sheet picks the
monitor and the app gets access to that one only, with no general Bluetooth
prompt. Older iOS and Android use a normal scan.

## Service

| Purpose | UUID |
| --- | --- |
| Service | `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` |
| RX, client → ESP32 (write with response) | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` |
| TX, ESP32 → client (notify) | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` |

- Enable TX notifications. End each command with `\n` (CRLF accepted); input
  is capped at 512 bytes.
- Replies are `\n`-terminated lines split into notifications of up to
  `MTU - 3` bytes (MTU 247 requested, 20-byte fallback). Buffer bytes and parse
  a line only when `\n` arrives.

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

Setters change memory only until `SAVE`. Values may contain colons; secrets
are never echoed. `SAVE` emits `SAVE_BEGIN`, `WIFI_CONNECTING`, then `SAVE_OK`
and `IP:<ip>` or `SAVE_FAILED:WIFI` / `SAVE_FAILED:STORAGE`, then `SAVE_END`.
Credentials are kept even if WiFi fails, so you only need to fix the network.

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

Live readings use the upload field names, with `null` for a missing sensor:

```json
{"pm1_0":3,"pm2_5":12,"pm10_0":18,"aqi":57,"temperature":24.5,"humidity":40.0,"heat_index":24.9,"uptime_ms":123456}
```

Unknown commands are echoed as `echo: <command>`. Errors start with `ERROR:`.
