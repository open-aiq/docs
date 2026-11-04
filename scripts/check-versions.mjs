// Validates the version registry (src/data/versions.json) that release
// scripts in every Open AIQ repository check before tagging a release.
import { readFile } from 'node:fs/promises'

const registry = JSON.parse(await readFile(new URL('../src/data/versions.json', import.meta.url), 'utf8'))
const failures = []
const MINOR = /^\d+\.\d+$/
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
}
if (current !== 1) failures.push(`lines: exactly one line must have status "current" (found ${current})`)

if (failures.length) {
  console.error(`Invalid version registry:\n${failures.join('\n')}`)
  process.exit(1)
}
console.log(`Version registry OK: ${lines.length} lines, ${seenVersions.size} component versions.`)
