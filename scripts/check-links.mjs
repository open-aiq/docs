import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, extname, join, normalize, resolve } from 'node:path'

async function files(directory) {
  return (await Promise.all((await readdir(directory)).map(async (name) => {
    const path = join(directory, name)
    return (await stat(path)).isDirectory() ? files(path) : path
  }))).flat()
}

const root = resolve('dist')
const htmlFiles = (await files(root)).filter((file) => extname(file) === '.html')
const failures = []
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1]
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(value)) continue
    const clean = value.split(/[?#]/)[0]
    let target = clean.startsWith('/docs/')
      ? join(root, clean.slice('/docs/'.length))
      : resolve(dirname(file), clean)
    if (clean.endsWith('/')) target = join(target, 'index.html')
    else if (!extname(target)) target = join(target, 'index.html')
    try { await stat(normalize(target)) } catch { failures.push(`${file.slice(root.length + 1)} -> ${value}`) }
  }
}
if (failures.length) {
  console.error(`Broken internal links:\n${[...new Set(failures)].join('\n')}`)
  process.exit(1)
}
console.log(`Checked internal links in ${htmlFiles.length} HTML files.`)
