---
title: BLE provisioning protocol
description: Provision the ESP32 through its Nordic UART Service.
---

:::caution[Flutter app status]
The Flutter provisioning app is work in progress. Its current code scans for Bluetooth devices but does not implement the complete command workflow. Use a generic Nordic UART client or mock provisioning for development.
:::

The monitor advertises as `AirMonitor-XXXX`, where the suffix is stable for the chip. It implements Nordic UART Service (NUS):

| Purpose | UUID |
| --- | --- |
| Service | `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` |
| RX, client → ESP32 | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` |
| TX, ESP32 → client | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` |

Enable TX notifications and terminate every command with `\n`. Firmware accepts CRLF too. Incoming command buffering is capped at 512 bytes.

```text
SSID:Your network
PASS:Your password
LAT:24.8607
LON:67.0011
DEVID:dev_...
DEVKEY:sk_...
SAVE
```

Passwords may contain colons. Secret values are never echoed. `PING` returns `PONG`; `STATUS` reports Wi-Fi state and IP; `CLEAR` erases flash configuration.

`LOAD` is framed by `LOAD_BEGIN` and `LOAD_END`, with `PASS_SET` and `DEVKEY_SET` flags instead of secrets. `SAVE` emits `SAVE_BEGIN`, attempts Wi-Fi, then returns either `SAVE_OK` (and `IP:`) or `SAVE_FAILED:WIFI`, followed by `SAVE_END`.

The default ATT payload is 20 bytes, so a logical response can span notifications. Clients must concatenate notification bytes and emit complete lines only when `\n` arrives.
