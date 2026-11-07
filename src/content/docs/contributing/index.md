---
title: Contributor setup
description: Build and check each Open AIQ repository.
---

Thanks for helping out. Run commands from inside the repository you're changing, check `git status` first, and leave unrelated local changes alone.

## Backend

Needs Go 1.26+, PostgreSQL and the tools in its README. Copy `.env.example` to `.env` (ignored by Git); every value is required.

```bash
make help
make init
make swagger:gen
make build
make verify
```

Edit Ent schemas under `internal/platform/ent/schema/` and regenerate with the Make target; don't edit generated files. The Docker image applies migrations on start; locally, run `make migration:apply`. Database start, seed and cleanup targets, and the release target, change persistent state, so check before running them.

## Frontend

Set `VITE_API_URL` and `VITE_CLERK_PUBLISHABLE_KEY` from `.env.example`, then:

```bash
make init
make dev
make verify     # format check, lint, tests, build
```

The backend's CORS and Clerk origins must match where the dashboard runs. Add shadcn primitives with its CLI, not by hand.

## Mobile app

Needs Flutter and a real phone; Bluetooth doesn't work in simulators.

```bash
make init
make dev        # runs against the backend on this machine
make verify     # format check, analyze, tests
```

Keep BLE UUIDs, commands, reply framing and notification reassembly in
`lib/ble/protocol.dart` in sync with the firmware. Tests run against an
in-memory device emulator, so you can catch mismatches without hardware.

## Device firmware

Needs the Xtensa Rust toolchain ([espup](https://github.com/esp-rs/espup))
and [espflash](https://github.com/esp-rs/espflash).

```bash
make build
make verify     # format, host tests, Clippy, both OLED builds
```

Flashing (`make flash`) needs hardware attached. Never commit or share a binary
built with `MOCK_*` values. See [Firmware setup](../device/firmware/).

## Releases

Every repository releases with `make release` from a clean `main`. A new major
or minor version must first be registered in the [version registry](../releases/).
Tagging and publishing are for maintainers.

## Documentation

Uses Node 24:

```bash
npm ci
npm run sync:api -- ../backend/docs/swagger.yaml
npm run validate
```

Run the API sync after generating Swagger; CI checks the snapshot matches `open-aiq/backend` main. Don't hand-edit the generated endpoint pages or the snapshot.
