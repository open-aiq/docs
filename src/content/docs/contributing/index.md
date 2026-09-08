---
title: Contributor setup
description: Build and verify each Open AIQ repository safely.
---

Each component is an independent repository. Run Git and project commands from that repository, inspect `git status` first, and preserve unrelated local work.

## Backend

Requires Go 1.26+, PostgreSQL, and the tools named in its README. Copy `.env.example` to the ignored `.env`; every value is required.

```bash
make help
make swagger
make build
go test ./...
```

Edit Ent schemas under `internal/platform/ent/schema/` and regenerate via the owning Make target. Database start, migration application, seeding, cleanup, and release targets modify external or persistent state—review and run them deliberately.

## Frontend

Configure `VITE_API_URL` and `VITE_CLERK_PUBLISHABLE_KEY` from `.env.example`, then:

```bash
npm ci
npm run dev
npm run lint
npm test
npm run build
```

Keep backend CORS/Clerk origins synchronized. Add shadcn primitives with its CLI rather than recreating them.

## Flutter app

The provisioning app is currently WIP.

```bash
flutter pub get
flutter analyze
flutter test
```

When implementing provisioning, keep UUIDs, commands, response framing, chunk buffering, and secret handling synchronized with firmware `src/ble.cpp`.

## Device firmware

Copy the secrets template locally, then run `pio run` or `make build`. Do not commit `secrets.h`. Upload, serial monitor, tag, and release operations need hardware or external authorization and should never be part of an incidental verification run.

## Documentation

The docs repository uses Node 24:

```bash
npm ci
npm run sync:api -- ../backend/docs/swagger.yaml
npm run validate
```

Run API synchronization after Swagger generation. CI compares the committed snapshot with `open-aiq/backend` main. Do not hand-edit generated API endpoint pages or the snapshot.
