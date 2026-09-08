---
title: Firmware setup and build
description: Configure and compile firmware for the ESP32 monitor.
---

Install PlatformIO, clone `open-aiq/aqs-device`, then create the ignored secrets file:

```bash
cp include/secrets.example.h include/secrets.h
pio run
```

`include/secrets.h` contains local development values for Wi-Fi, device credentials, and mock coordinates. Never commit it. The production backend base URL is defined by `BACKEND_BASE_URL` in `include/config.h` and can be overridden with a PlatformIO build flag.

Uploading and serial monitoring require attached hardware and are explicit actions:

```bash
pio run -t upload
pio device monitor
```

The monitor uses 9600 baud. `make build` wraps the normal build. `make merge` produces a combined flash image. Release targets create/push tags and publish GitHub releases; run them only with explicit maintainer intent and validated `VERSION`/release notes.

## Mock provisioning

For development, compile with `MOCK_APP_PROVISIONING=1`. On the first boot with empty flash, firmware copies values from `secrets.h` into persistent configuration. BLE remains active and can overwrite them.

Mock provisioning does not rerun after configuration exists. Send `CLEAR`, or temporarily compile with `WIPE_CONFIG_ON_BOOT=1`. Restore both flags to `0` afterward; otherwise every reboot discards provisioning.
