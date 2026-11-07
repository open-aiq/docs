# Open AIQ Documentation

Unified documentation for the Open AIQ hardware and software ecosystem, built with Astro Starlight and deployed to GitHub Pages at <https://docs.air-iq.net/>.

## Development

Use Node 24 and npm. Run `make help` to see every command.

```bash
make init
make dev
```

Run the full local validation before opening a pull request:

```bash
make verify
```

## Synchronize the API reference

Generate Swagger in a local backend checkout, then copy it deterministically:

```bash
make api:sync
```

Pass `SWAGGER=<path>` if your backend checkout lives somewhere else.

Generated endpoint pages use the committed Swagger 2.0 snapshot. The same command synchronizes the
generated RFC 9457 problem catalog. CI checks both artifacts against `open-aiq/backend` main.
