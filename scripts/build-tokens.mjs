// Generates each platform's theme values from src/data/tokens.json, the one
// source for Sand & Sage. Run from docs/:
//
//   node scripts/build-tokens.mjs           write every output
//   node scripts/build-tokens.mjs --check   exit 1 if any output is stale
//
// Outputs in sibling repositories (../frontend, ../app, ../device) are written only when
// that repository is checked out next to docs, so docs CI works on its own.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const check = process.argv.includes("--check");
const tokens = JSON.parse(await readFile(resolve("src/data/tokens.json"), "utf8"));
const icons = JSON.parse(await readFile(resolve("src/data/icons.json"), "utf8"));
const MODES = ["light", "dark"];
const HEADER = "Generated from docs/src/data/tokens.json by `make tokens:sync` in docs/. Don't edit.";

const css = (lines) => `/* ${HEADER} */\n${lines.join("\n")}\n`;
const block = (selector, vars) =>
  [`${selector} {`, ...Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`), "}"].join("\n");

const color = (mode, role) => {
  const value = tokens.color[mode][role];
  if (!value) throw new Error(`Unknown color role ${mode}.${role}`);
  return value;
};
const brand = (mode, name) => tokens.brand[mode][name];
const easing = `cubic-bezier(${tokens.motion.easing.calm.join(", ")})`;

// --- Web dashboard (shadcn variables) ---------------------------------------

// Each shadcn variable comes from a Material 3 role. A pair is [light, dark];
// cards use the same "raised surface" rule as raisedSurface() in the app.
const SHADCN = {
  background: "surface",
  foreground: "onSurface",
  card: ["surfaceContainerLowest", "surfaceContainer"],
  "card-foreground": "onSurface",
  popover: ["surfaceContainerLowest", "surfaceContainerHigh"],
  "popover-foreground": "onSurface",
  primary: "primary",
  "primary-foreground": "onPrimary",
  secondary: "secondaryContainer",
  "secondary-foreground": "onSecondaryContainer",
  muted: ["surfaceContainer", "surfaceContainerHigh"],
  "muted-foreground": "onSurfaceVariant",
  accent: "primaryContainer",
  "accent-foreground": "onPrimaryContainer",
  destructive: "error",
  border: "outlineVariant",
  input: "outlineVariant",
  ring: "primary",
  "chart-1": "primary",
  "chart-2": "secondary",
  "chart-3": "brand:wood",
  "chart-4": ["outline", "onSurfaceVariant"],
  "chart-5": "onSurface",
  sidebar: "surfaceContainerLow",
  "sidebar-foreground": "onSurface",
  "sidebar-primary": "primary",
  "sidebar-primary-foreground": "onPrimary",
  "sidebar-accent": "primaryContainer",
  "sidebar-accent-foreground": "onPrimaryContainer",
  "sidebar-border": "outlineVariant",
  "sidebar-ring": "primary",
};

function resolveRef(mode, ref) {
  const name = Array.isArray(ref) ? ref[mode === "light" ? 0 : 1] : ref;
  return name.startsWith("brand:") ? brand(mode, name.slice(6)) : color(mode, name);
}

function webVars(mode) {
  const vars = {};
  for (const [name, ref] of Object.entries(SHADCN)) vars[name] = resolveRef(mode, ref);
  // Brand colors keep their own names, except where shadcn already uses the
  // name (accent) or the shadow tokens below cover it.
  for (const [name, value] of Object.entries(tokens.brand[mode])) {
    if (!(name in vars) && name !== "shadow") vars[name] = value;
  }
  vars["shadow-rest"] = tokens.shadow[mode].rest;
  vars["shadow-hover"] = tokens.shadow[mode].lift;
  if (mode === "light") {
    for (const [name, px] of Object.entries(tokens.radius)) vars[`aiq-radius-${name}`] = `${px / 16}rem`;
    for (const [name, ms] of Object.entries(tokens.motion.duration)) vars[`aiq-duration-${name}`] = `${ms}ms`;
    vars["aiq-ease"] = easing;
    vars["aiq-float-distance"] = `${tokens.motion.floatDistance}px`;
  }
  return vars;
}

const frontendTokensCss = () =>
  css([block(":root", webVars("light")), "", block(".dark", webVars("dark"))]);

const frontendAqiJs = () => {
  const bands = tokens.aqi.bands.map(({ max, label, short, bg, fg }) => ({
    max: max ?? "Infinity",
    label,
    short,
    bg,
    fg,
  }));
  const body = JSON.stringify(bands, null, 2).replace(/"Infinity"/g, "Infinity");
  return [
    `// ${HEADER}`,
    "",
    "// US EPA AQI bands with the IQAir AirVisual palette.",
    `export const BANDS = ${body}`,
    "",
    `export const UNKNOWN = ${JSON.stringify(tokens.aqi.unknown, null, 2)}`,
    "",
  ].join("\n");
};

// Material icons as React components, the same glyphs the app draws with
// Flutter's Icons.* (see src/data/icons.json and scripts/extract-icons.py).
const frontendIconsJsx = () => {
  const lines = [
    "// Generated from docs/src/data/icons.json by `make tokens:sync` in docs/. Don't edit.",
    "// Material Icons by Google, Apache License 2.0.",
    "",
    `const VIEW_BOX = '${icons.viewBox}'`,
    "",
    "function icon(path, displayName) {",
    "  function Icon({ className, title, ...props }) {",
    "    return (",
    "      <svg",
    "        viewBox={VIEW_BOX}",
    "        fill=\"currentColor\"",
    "        className={`shrink-0 ${className ?? 'size-4'}`}",
    "        aria-hidden={title ? undefined : true}",
    "        role={title ? 'img' : undefined}",
    "        {...props}",
    "      >",
    "        {title && <title>{title}</title>}",
    "        <path d={path} />",
    "      </svg>",
    "    )",
    "  }",
    "  Icon.displayName = displayName",
    "  return Icon",
    "}",
    "",
  ];
  for (const [name, { flutter, path }] of Object.entries(icons.icons)) {
    const component = `${name[0].toUpperCase()}${name.slice(1)}Icon`;
    lines.push(`/** ${flutter} in the app. */`, `export const ${component} = icon('${path}', '${component}')`, "");
  }
  return lines.join("\n");
};

// --- Docs site (Starlight variables) ----------------------------------------

function docsVars(mode) {
  const vars = {
    "sl-color-accent-low": brand(mode, "sand"),
    "sl-color-accent": color(mode, "primary"),
    "sl-color-accent-high": color(mode, "onSurface"),
    "sl-color-text-accent": tokens.docs[mode].textAccent,
  };
  for (const [name, value] of Object.entries(tokens.brand[mode])) vars[`oa-${name}`] = value;
  vars["oa-shadow-rest"] = tokens.shadow[mode].rest;
  vars["oa-shadow-lift"] = tokens.shadow[mode].lift;
  for (const role of Object.keys(tokens.color[mode])) {
    vars[`oa-${role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`] = color(mode, role);
  }
  vars["oa-raised"] = color(mode, mode === "light" ? "surfaceContainerLowest" : "surfaceContainer");
  if (mode === "light") {
    for (const [name, px] of Object.entries(tokens.radius)) vars[`oa-radius-${name}`] = `${px / 16}rem`;
    for (const [name, ms] of Object.entries(tokens.motion.duration)) vars[`oa-duration-${name}`] = `${ms}ms`;
    vars["oa-ease"] = easing;
    tokens.aqi.bands.forEach((band, index) => {
      vars[`oa-aqi-${index + 1}-bg`] = band.bg;
      vars[`oa-aqi-${index + 1}-fg`] = band.fg;
    });
  }
  return vars;
}

const docsTokensCss = () =>
  css([
    "/* Starlight's :root holds its dark defaults; light values are set below. */",
    block(":root", docsVars("light")),
    "",
    block(":root[data-theme='dark']", docsVars("dark")),
    "",
    block(":root[data-theme='light']", {
      "sl-color-bg": color("light", "surface"),
      "sl-color-bg-nav": color("light", "surfaceContainerLow"),
      "sl-color-bg-sidebar": color("light", "surfaceContainerLow"),
    }),
  ]);

// --- Mobile app (Dart) -------------------------------------------------------

const dartColor = (hex) => {
  const h = hex.replace("#", "");
  const rgb = h.slice(0, 6).toUpperCase();
  const alpha = (h.length === 8 ? h.slice(6, 8) : "ff").toUpperCase();
  return `Color(0x${alpha}${rgb})`;
};
const dartString = (value) => `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

function appDart() {
  const roles = Object.keys(tokens.color.light);
  const brandNames = Object.keys(tokens.brand.light);
  const lines = [
    `// ${HEADER}`,
    "",
    "import 'package:flutter/widgets.dart';",
    "",
    "/// Material 3 color roles for one brightness.",
    "@immutable",
    "class AiqSchemeTokens {",
    "  const AiqSchemeTokens({",
    ...roles.map((r) => `    required this.${r},`),
    "  });",
    "",
    ...roles.map((r) => `  final Color ${r};`),
    "",
  ];
  for (const mode of MODES) {
    lines.push(`  static const ${mode} = AiqSchemeTokens(`);
    for (const r of roles) lines.push(`    ${r}: ${dartColor(color(mode, r))},`);
    lines.push("  );", "");
  }
  lines.push("}", "");
  for (const mode of MODES) {
    const name = `AiqBrand${mode[0].toUpperCase()}${mode.slice(1)}`;
    lines.push(`/// Brand and illustration colors, ${mode} mode.`, `abstract final class ${name} {`);
    for (const b of brandNames) lines.push(`  static const ${b} = ${dartColor(brand(mode, b))};`);
    lines.push("}", "");
  }
  lines.push("/// Corner radii in logical pixels.", "abstract final class AiqRadii {");
  for (const [name, px] of Object.entries(tokens.radius)) lines.push(`  static const double ${name} = ${px};`);
  lines.push("}", "");
  const [x1, y1, x2, y2] = tokens.motion.easing.calm;
  lines.push("/// Motion timings. Every animation stops under reduced motion.", "abstract final class AiqMotion {");
  for (const [name, ms] of Object.entries(tokens.motion.duration))
    lines.push(`  static const ${name} = Duration(milliseconds: ${ms});`);
  lines.push(
    `  static const calm = Cubic(${x1}, ${y1}, ${x2}, ${y2});`,
    `  static const double floatDistance = ${tokens.motion.floatDistance};`,
    "}",
    "",
    "/// One US EPA AQI band. [max] is null for the open-ended top band.",
    "typedef AiqBandToken = ({int? max, String label, String short, Color background, Color foreground});",
    "",
    "const aiqBands = <AiqBandToken>[",
  );
  for (const band of tokens.aqi.bands) {
    lines.push(
      `  (max: ${band.max ?? "null"}, label: ${dartString(band.label)}, short: ${dartString(band.short)}, background: ${dartColor(band.bg)}, foreground: ${dartColor(band.fg)}),`,
    );
  }
  const u = tokens.aqi.unknown;
  lines.push(
    "];",
    "",
    `const aiqUnknownBand = (max: null, label: ${dartString(u.label)}, short: ${dartString(u.short)}, background: ${dartColor(u.bg)}, foreground: ${dartColor(u.fg)});`,
    "",
  );
  return lines.join("\n");
}

// The app formats Dart with `dart format`, so run generated Dart through it
// too; otherwise the app's format check and this generator would disagree.
function formatDart(source) {
  const dir = mkdtempSync(join(tmpdir(), "aiq-tokens-"));
  const file = join(dir, "tokens.g.dart");
  try {
    writeFileSync(file, source);
    execFileSync("dart", ["format", "--language-version=latest", file], { stdio: "ignore" });
    return readFileSync(file, "utf8");
  } catch {
    console.warn("dart isn't available, so tokens.g.dart is unformatted. Run `make format:fix` in app/.");
    return source;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- Device firmware (Rust) --------------------------------------------------

// Band names for the OLED and colours for the status LED. Laid out the way
// rustfmt would, so the firmware's format check passes.
function deviceRust() {
  const rustString = (value) => JSON.stringify(value);
  const rgb = (hex) =>
    [1, 3, 5].map((i) => `0x${hex.slice(i, i + 2).toLowerCase()}`).join(", ");
  const lines = [
    `// ${HEADER}`,
    "",
    "/// One US EPA AQI band. `max` is `None` for the open-ended top band.",
    "#[derive(Clone, Copy, Debug, Eq, PartialEq)]",
    "pub struct Band {",
    "    pub max: Option<u16>,",
    "    pub label: &'static str,",
    "    pub rgb: (u8, u8, u8),",
    "}",
    "",
    `pub const BANDS: [Band; ${tokens.aqi.bands.length}] = [`,
  ];
  for (const band of tokens.aqi.bands) {
    lines.push(
      "    Band {",
      `        max: ${band.max == null ? "None" : `Some(${band.max})`},`,
      `        label: ${rustString(band.label)},`,
      `        rgb: (${rgb(band.bg)}),`,
      "    },",
    );
  }
  lines.push("];", "");
  return lines.join("\n");
}

// --- Write or check ----------------------------------------------------------

const OUTPUTS = [
  { path: "src/styles/tokens.css", build: docsTokensCss },
  { path: "../frontend/src/styles/tokens.css", build: frontendTokensCss, repo: "../frontend" },
  { path: "../frontend/src/lib/aqi-bands.g.js", build: frontendAqiJs, repo: "../frontend" },
  { path: "../frontend/src/components/icons.g.jsx", build: frontendIconsJsx, repo: "../frontend" },
  { path: "../app/lib/tokens.g.dart", build: () => formatDart(appDart()), repo: "../app" },
  { path: "../device/src/aqi/bands.g.rs", build: deviceRust, repo: "../device" },
];

let stale = 0;
for (const output of OUTPUTS) {
  if (output.repo && !existsSync(resolve(output.repo))) {
    console.log(`Skipped ${output.path} (${output.repo} isn't checked out)`);
    continue;
  }
  const target = resolve(output.path);
  const contents = output.build();
  if (check) {
    const current = existsSync(target) ? await readFile(target, "utf8") : "";
    if (current !== contents) {
      console.error(`Stale: ${output.path}`);
      stale += 1;
    }
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  await writeFile(target, contents);
  console.log(`Wrote ${output.path}`);
}

if (stale) {
  console.error("Design tokens are out of date. Run `make tokens:sync` in docs/ and commit the results.");
  process.exit(1);
}
if (check) console.log("Design tokens are up to date.");
