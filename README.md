# Open AIQ Documentation

Unified documentation for the Open AIQ hardware and software ecosystem, built with Astro Starlight and deployed to GitHub Pages at <https://docs.air-iq.net/>.

## Development

Use Node 24 and npm:

```bash
npm ci
npm run dev
```

Run the full local validation before opening a pull request:

```bash
npm run validate
```

## Synchronize the API reference

Generate Swagger in a local backend checkout, then copy it deterministically:

```bash
npm run sync:api -- ../backend/docs/swagger.yaml
```

Generated endpoint pages use the committed Swagger 2.0 snapshot. CI checks that it matches `open-aiq/backend` main.
