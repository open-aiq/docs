NPM ?= npm

# Swagger file to copy in with api:sync.
SWAGGER ?= ../backend/docs/swagger.yaml

.PHONY: help init dev build preview types\:check versions\:check links\:check api\:sync api\:check tokens\:sync tokens\:check icons\:sync brand\:sync verify clean

## help: Show available commands
help:
	@echo "Available commands:"
	@echo ""
	@sed -n 's/^## //p' $(MAKEFILE_LIST) | awk '{ i = index($$0, ": "); if (i) printf "  %-20s %s\n", substr($$0, 1, i - 1), substr($$0, i + 2); else print "" }'

## init: Install the exact dependencies from package-lock.json
init:
	$(NPM) ci

## dev: Start the Astro dev server with live reload
dev:
	$(NPM) run dev

## build: Build the static site into dist/
build:
	$(NPM) run build

## preview: Serve the production build locally
preview:
	$(NPM) run preview

## types:check: Type-check pages and components with astro check
types\:check:
	$(NPM) run check

## versions:check: Check that documented versions match the releases
versions\:check:
	$(NPM) run check:versions

## links:check: Check internal links in the built site (run build first)
links\:check:
	node scripts/check-links.mjs

##.
## api:sync: Copy the backend Swagger snapshot and problem catalog — make api:sync [SWAGGER=../backend/docs/swagger.yaml]
api\:sync:
	$(NPM) run sync:api -- $(SWAGGER)

## api:check: Check the API snapshot against open-aiq/backend main
api\:check:
	$(NPM) run check:api

##.
## tokens:sync: Generate the docs, frontend and app theme files and the firmware's AQI bands from src/data/tokens.json
tokens\:sync:
	$(NPM) run sync:tokens

## tokens:check: Check that every generated theme file matches src/data/tokens.json
tokens\:check:
	$(NPM) run check:tokens

## icons:sync: Copy the app's Material icons into src/data/icons.json (needs Flutter and fonttools), then run tokens:sync
icons\:sync:
	python3 scripts/extract-icons.py
	$(NPM) run sync:tokens

## brand:sync: Draw the logo (favicons, Starlight logo, app launcher icons, org avatar) from src/data/tokens.json
brand\:sync:
	$(NPM) run sync:brand

##.
## verify: Run versions:check, tokens:check, types:check, build and links:check
verify:
	$(NPM) run validate

## clean: Remove build output and Astro's cache
clean:
	rm -rf dist/ .astro/
