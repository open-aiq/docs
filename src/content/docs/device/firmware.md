---
title: Firmware setup
description: Flash a release image or build the Rust firmware from source.
---

The firmware lives in [`open-aiq/device`](https://github.com/open-aiq/device).
It is Rust on ESP-IDF for the ESP32-S3.

## Flash a release

Each [firmware release](../../releases/) has two images per OLED controller:

| File | Use |
| --- | --- |
| `airmonitor-<version>-<oled>-full.bin` | First USB flash: bootloader, partition table, and app, written at `0x0` |
| `airmonitor-<version>-<oled>-ota.bin` | App image only, used for over-the-air updates |

```bash
espflash write-bin 0x0 airmonitor-v0.3.0-sh1106-full.bin
```

Check the file against `SHA256SUMS` first. After the first flash, updates
arrive [over the air](../ota/).

## Build from source

You need the Xtensa Rust toolchain from
[espup](https://github.com/esp-rs/espup) and
[espflash](https://github.com/esp-rs/espflash). `rust-toolchain.toml` selects
the `esp` toolchain.

```bash
make help                            # every command
make build                           # release build for the default SH1106 OLED
make build OLED_CONTROLLER=ssd1306
make verify                          # format, host tests, Clippy, both OLED builds
make flash                           # build, flash with partitions + rollback bootloader, monitor
make monitor                         # serial monitor only
```

Always flash with `make flash`. Plain `espflash flash` replaces the A/B
partition table and the rollback bootloader with espflash's defaults.

The backend URL defaults to `https://api.air-iq.net/api/v1`. To use another
backend, set `BACKEND_BASE_URL` at build time. HTTPS uses ESP-IDF's built-in
certificate bundle.

## Serial console

With `make monitor` open, type a line and press Enter to stand in for the
buttons:

| Line | Same as |
| --- | --- |
| `BTN:PAIR` | Holding both buttons for 3 s |
| `BTN:LEFT` / `BTN:RIGHT` | Left / right button |
| `BTN:HELP` | Lists these commands |

## Development provisioning

A development build can seed empty storage without the app:

```bash
MOCK_WIFI_SSID=... MOCK_WIFI_PASSWORD=... \
MOCK_DEVICE_ID=dev_... MOCK_DEVICE_KEY=sk_... \
MOCK_LAT=24.8607 MOCK_LON=67.0011 make build
```

The values are compiled into that binary, so never share or release it.
`WIPE_CONFIG_ON_BOOT=1` erases storage on every boot and is only for a
deliberate reset build.

## Releases

Maintainers run `make release` on a clean `main`. It checks the
[version registry](../../releases/), runs `make verify`, builds both images for
both OLED controllers, tags the version, and publishes a GitHub release.
