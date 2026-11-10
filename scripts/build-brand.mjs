// Draws the Open AIQ logo for every place it appears, from one glyph and the
// brand colors in src/data/tokens.json. Run from docs/ with `make brand:sync`.
//
// The mark is lucide's "wind" icon (ISC license, https://lucide.dev), on a
// rounded sand tile with a wood outline: Sand & Sage. It writes:
//
//   src/assets/brand/*.svg          the source shapes, also the Starlight logo
//   public/favicon.svg              the docs favicon (follows light and dark)
//   public/brand/open-aiq-512.png   the GitHub organization avatar
//   ../frontend/public/favicon.svg  the dashboard favicon
//   ../app/...                      Android, iOS and web launcher icons
//
// Outputs in sibling repositories are written only when that repository is
// checked out next to docs, so docs works on its own.
import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const tokens = JSON.parse(await readFile(resolve("src/data/tokens.json"), "utf8"));
const brand = (mode) => tokens.brand[mode];

// lucide "wind", drawn in a 24 × 24 box.
const WIND = [
  "M12.8 19.6A2 2 0 1 0 14 16H2",
  "M17.5 8a2.5 2.5 0 1 1 2 4H2",
  "M9.8 4.4A2 2 0 1 1 11 8H2",
];
const LICENSE = "<!-- Wind glyph from lucide (https://lucide.dev), ISC license. -->";

// The glyph sits a touch right of the box's center, so nudge it back.
const glyph = ({ size, center, stroke, width = 2.25 }) => {
  const scale = size / 24;
  const x = center - 12 * scale - 0.5 * scale;
  const y = center - 12 * scale;
  return [
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${stroke}"`,
    ` stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">`,
    ...WIND.map((d) => `<path d="${d}"/>`),
    "</g>",
  ].join("");
};

const svg = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${LICENSE}${body}</svg>\n`;

// The tile: a 64 × 64 rounded square with transparent corners.
const tile = (colors) =>
  svg(
    "0 0 64 64",
    `<rect x="4" y="4" width="56" height="56" rx="16" fill="${colors.sand}" stroke="${colors.wood}"` +
      ` stroke-width="2.5" stroke-linejoin="round"/>` +
      glyph({ size: 36, center: 32, stroke: colors.sage }),
  );

// The favicon is the tile, switching to the dark colors with the system.
const light = brand("light");
const dark = brand("dark");
const favicon = svg(
  "0 0 64 64",
  `<style>.t{fill:${light.sand};stroke:${light.wood}}.g{stroke:${light.sage}}` +
    `@media (prefers-color-scheme:dark){.t{fill:${dark.sand};stroke:${dark.wood}}.g{stroke:${dark.sage}}}</style>` +
    `<rect class="t" x="4" y="4" width="56" height="56" rx="16" stroke-width="2.5" stroke-linejoin="round"/>` +
    glyph({ size: 36, center: 32, stroke: "currentColor" }).replace('stroke="currentColor"', 'class="g"'),
);

// Full-bleed and opaque, for icons the platform masks itself (iOS, Android
// maskable web icons, the GitHub avatar). The glyph stays well inside the
// maskable safe zone, a circle 80% of the width.
const fullBleed = svg(
  "0 0 1024 1024",
  `<rect width="1024" height="1024" fill="${light.sand}"/>` +
    glyph({ size: 560, center: 512, stroke: light.sage }),
);

const mark = svg(
  "0 0 24 24",
  `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    WIND.map((d) => `<path d="${d}"/>`).join("") +
    "</g>",
);

const SVGS = [
  { path: "src/assets/brand/wind-mark.svg", contents: mark },
  { path: "src/assets/brand/logo-light.svg", contents: tile(light) },
  { path: "src/assets/brand/logo-dark.svg", contents: tile(dark) },
  { path: "src/assets/brand/app-icon.svg", contents: fullBleed },
  { path: "public/favicon.svg", contents: favicon },
  { path: "../frontend/public/favicon.svg", contents: favicon, repo: "../frontend" },
];

const IOS = "../app/ios/Runner/Assets.xcassets/AppIcon.appiconset";
const iosSizes = [
  [20, 1], [20, 2], [20, 3], [29, 1], [29, 2], [29, 3], [40, 1], [40, 2], [40, 3],
  [60, 2], [60, 3], [76, 1], [76, 2], [83.5, 2], [1024, 1],
];
const ANDROID = "../app/android/app/src/main/res";
const androidSizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

// `source` is "tile" (transparent corners) or "full" (opaque, full-bleed).
const PNGS = [
  { path: "public/brand/open-aiq-512.png", size: 512, source: "full" },
  ...iosSizes.map(([points, scale]) => ({
    path: `${IOS}/Icon-App-${points}x${points}@${scale}x.png`,
    size: Math.round(points * scale),
    source: "full",
    repo: "../app",
  })),
  ...Object.entries(androidSizes).map(([density, size]) => ({
    path: `${ANDROID}/mipmap-${density}/ic_launcher.png`,
    size,
    source: "tile",
    repo: "../app",
  })),
  { path: "../app/web/favicon.png", size: 32, source: "tile", repo: "../app" },
  { path: "../app/web/icons/Icon-192.png", size: 192, source: "tile", repo: "../app" },
  { path: "../app/web/icons/Icon-512.png", size: 512, source: "tile", repo: "../app" },
  { path: "../app/web/icons/Icon-maskable-192.png", size: 192, source: "full", repo: "../app" },
  { path: "../app/web/icons/Icon-maskable-512.png", size: 512, source: "full", repo: "../app" },
];

const skipped = new Set();
const available = (repo) => {
  if (!repo || existsSync(resolve(repo))) return true;
  if (!skipped.has(repo)) console.log(`Skipped ${repo} outputs (it isn't checked out)`);
  skipped.add(repo);
  return false;
};

for (const { path, contents, repo } of SVGS) {
  if (!available(repo)) continue;
  mkdirSync(dirname(resolve(path)), { recursive: true });
  await writeFile(resolve(path), contents);
  console.log(`Wrote ${path}`);
}

const sources = { tile: Buffer.from(tile(light)), full: Buffer.from(fullBleed) };
for (const { path, size, source, repo } of PNGS) {
  if (!available(repo)) continue;
  // Render at twice the target size, then scale down for smooth edges.
  const units = source === "tile" ? 64 : 1024;
  let image = sharp(sources[source], { density: (72 * size * 2) / units }).resize(size, size);
  // App stores reject icons with an alpha channel, so full-bleed icons are flat.
  if (source === "full") image = image.flatten({ background: light.sand }).removeAlpha();
  mkdirSync(dirname(resolve(path)), { recursive: true });
  await image.png({ compressionLevel: 9 }).toFile(resolve(path));
  console.log(`Wrote ${path} (${size} × ${size})`);
}
