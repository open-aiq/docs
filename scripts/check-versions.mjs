// Validates the version registry (src/data/versions.json) that release
// scripts in every Open AIQ repository check before tagging a release.
import { readFile } from 'node:fs/promises'

const registry = JSON.parse(await readFile(new URL('../src/data/versions.json', import.meta.url), 'utf8'))
const failures = []
const MINOR = /^\d+\.\d+$/
const EXACT = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/
const STATUSES = new Set(['current', 'superseded', 'planned'])

const components = registry.components ?? {}
for (const [key, component] of Object.entries(components)) {
  if (!component.name) failures.push(`components.${key}: missing name`)
  if (!/^[\w.-]+\/[\w.-]+$/.test(component.repo ?? '')) failures.push(`components.${key}: repo must be owner/name`)
  for (const link of component.links ?? []) {
    if (!link.label || !/^https:\/\//.test(link.url ?? '')) failures.push(`components.${key}: links need a label and an https url`)
  }
}

const lines = registry.lines ?? []
if (!lines.length) failures.push('lines: at least one line is required')
const seenLines = new Set()
const seenVersions = new Map()
let current = 0
for (const entry of lines) {
  const where = `lines[${entry.line}]`
  if (!MINOR.test(entry.line ?? '')) failures.push(`${where}: line must look like 0.4`)
  if (seenLines.has(entry.line)) failures.push(`${where}: duplicate line`)
  seenLines.add(entry.line)
  if (!STATUSES.has(entry.status)) failures.push(`${where}: status must be one of ${[...STATUSES].join(', ')}`)
  if (entry.status === 'current') current++
  const entries = Object.entries(entry.components ?? {})
  if (!entries.length) failures.push(`${where}: lists no components`)
  for (const [key, version] of entries) {
    if (!components[key]) failures.push(`${where}: unknown component ${key}`)
    if (!MINOR.test(version)) failures.push(`${where}: ${key} must be a major.minor like 0.4, got ${version}`)
    const id = `${key}@${version}`
    if (seenVersions.has(id)) failures.push(`${where}: ${key} ${version} is already registered in line ${seenVersions.get(id)}`)
    seenVersions.set(id, entry.line)
  }
  for (const [key, releases] of Object.entries(entry.releases ?? {})) {
    const minor = entry.components?.[key]
    if (!minor) failures.push(`${where}: releases.${key} lists a component this line does not register`)
    if (!Array.isArray(releases)) {
      failures.push(`${where}: releases.${key} must be a list`)
      continue
    }
    const seen = new Set()
    for (const release of releases) {
      const label = `${where}: releases.${key} ${release.version}`
      if (!EXACT.test(release.version ?? '')) failures.push(`${label}: version must look like 0.4.1`)
      else if (minor && !release.version.startsWith(`${minor}.`)) failures.push(`${label}: not in ${key} ${minor}`)
      if (seen.has(release.version)) failures.push(`${label}: listed twice`)
      seen.add(release.version)
      if (release.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(release.date)) failures.push(`${label}: date must be YYYY-MM-DD`)
      if (!release.info || release.info.trim().split(/\s+/).length > 3) {
        failures.push(`${label}: info must be a short label (1-3 words)`)
      }
    }
  }
}
if (current !== 1) failures.push(`lines: exactly one line must have status "current" (found ${current})`)

if (failures.length) {
  console.error(`Invalid version registry:\n${failures.join('\n')}`)
  process.exit(1)
}
console.log(`Version registry OK: ${lines.length} lines, ${seenVersions.size} component versions.`)
