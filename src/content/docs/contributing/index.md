---
title: Contributor setup
description: Build and verify each Open AIQ repository safely.
---

Each component is an independent repository. Run Git and project commands from that repository, inspect `git status` first, and preserve unrelated local work.

## Backend

Requires Go 1.26+, PostgreSQL, and the tools named in its README. Copy `.env.example` to the ignored `.env`; every value is required.

```bash
make help
make init
make swagger:gen
make build
make verify
```

Edit Ent schemas under `internal/platform/ent/schema/` and regenerate via the owning Make target. The Docker image applies pending migrations when the container starts; locally, apply them with `make migration:apply`. Database start, seeding, cleanup, and release targets change persistent state, so run them deliberately.

## Frontend

Configure `VITE_API_URL` and `VITE_CLERK_PUBLISHABLE_KEY` from `.env.example`, then:

```bash
make init
make dev
make verify     # format check, lint, tests, build
```

Keep backend CORS/Clerk origins synchronized. Add shadcn primitives with its CLI rather than recreating them.

## Mobile app

Requires Flutter and a phone; Bluetooth doesn't work in simulators.

```bash
make init
make dev        # runs against the backend on this machine
make verify     # format check, analyze, tests
```

Keep BLE UUIDs, commands, reply framing, and notification reassembly in
`lib/ble/protocol.dart` in sync with the firmware. The tests run the protocol
and provisioning flow against an in-memory device emulator.

## Device firmware

Requires the Xtensa Rust toolchain ([espup](https://github.com/esp-rs/espup))
and [espflash](https://github.com/esp-rs/espflash).

```bash
make build
make verify     # format, host tests, Clippy, both OLED builds
```

Flashing (`make flash`) needs attached hardware. Never commit or share a
binary built with `MOCK_*` values. See [Firmware setup](../device/firmware/).

## Releases

Every repository releases with `make release` from a clean `main`. Each one
checks the [version registry](../releases/) first: a new major or minor version
must be registered in this docs repository before it can be released. Tagging
and publishing a release are deliberate maintainer actions.

## Documentation

The docs repository uses Node 24:

```bash
npm ci
npm run sync:api -- ../backend/docs/swagger.yaml
npm run validate
```

Run API synchronization after Swagger generation. CI compares the committed snapshot with `open-aiq/backend` main. Do not hand-edit generated API endpoint pages or the snapshot.
