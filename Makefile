NPM ?= npm

# Swagger file to copy in with api:sync.
SWAGGER ?= ../backend/docs/swagger.yaml

.PHONY: help init dev build preview types\:check versions\:check links\:check api\:sync api\:check verify clean

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
## verify: Run versions:check, types:check, build and links:check
verify:
	$(NPM) run validate

## clean: Remove build output and Astro's cache
clean:
	rm -rf dist/ .astro/
