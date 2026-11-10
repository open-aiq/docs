---
title: Contributor setup
description: Build and check each Open AIQ repository.
---

We're glad you're here. Fixes, docs tweaks, bug reports and questions all help, and small contributions count as much as big ones.

If you get stuck or aren't sure where to start, open an issue or discussion in the relevant repository at [github.com/open-aiq](https://github.com/open-aiq). We're happy to help.

Run commands inside the repository you're changing, check `git status` first, and leave unrelated local changes alone.

## Backend

Needs Go 1.26+, PostgreSQL and the tools in its README. Copy `.env.example` to `.env` (ignored by Git); every value is required.

```bash
make help
make init
make swagger:gen
make build
make verify
```

- Edit Ent schemas under `internal/platform/ent/schema/`, then regenerate with the Make target. Don't edit generated files.
- The Docker image applies migrations on start; locally, run `make migration:apply`.
- Database start, seed, cleanup and release targets change persistent state, so check before running them.

## Frontend

There's no live dev server. The production Clerk key only works on the deployed domain, so you review visuals locally with mock data and test everything else live:

```bash
make init
make review     # the real pages with mock data, no backend or sign-in
make verify     # format check, lint, tests, build
```

`make review` has a small panel for switching scenarios (no devices, offline, errors, loading, signed out) and jumping between pages, including a **Playground** that mirrors the [visual playground](./visual-playground/). Use the shared tokens and the surface utilities in `src/index.css` instead of hard-coded colors.

The backend's CORS and Clerk origins must match the deployed dashboard. Add shadcn primitives with its CLI, not by hand.

## Mobile app

Needs Flutter and a real phone; Bluetooth doesn't work in simulators.

```bash
make init
make dev        # runs against the backend on this machine
make gallery    # the shared components with mock data (a simulator is fine)
make verify     # format check, analyze, tests
```

Keep BLE UUIDs, commands, reply framing and notification reassembly in
`lib/ble/protocol.dart` in sync with the firmware. Tests use an in-memory
device emulator, so you can catch mismatches without hardware.

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

Each repository releases with `make release` from a clean `main`. Register a
new major or minor version in the [version registry](../releases/) first.
Tagging and publishing are for maintainers.

## Documentation

Needs Node 24.

```bash
make init
make dev
make api:sync     # after regenerating Swagger in the backend
make tokens:sync  # after changing src/data/tokens.json
make icons:sync   # after changing which Material icons we share
make brand:sync   # after changing the logo or the brand colors
make verify
```

CI checks the API snapshot matches `open-aiq/backend` main. Don't hand-edit the generated endpoint pages or the snapshot.

`src/data/tokens.json` holds the design tokens for every platform: colors, radii, shadows, motion and AQI bands. `make tokens:sync` regenerates the theme files in docs, `../frontend` and `../app`, and `make verify` fails if they drift. The [visual playground](./visual-playground/) shows the tokens and the shared components. The logo is lucide's wind glyph on a sand tile. `make brand:sync` draws it from the same brand colors into the favicons, the docs header, the app's launcher icons and `public/brand/open-aiq-512.png`, the GitHub organization avatar.
