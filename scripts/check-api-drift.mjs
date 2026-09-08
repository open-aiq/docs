import { readFile } from 'node:fs/promises'

const upstream = process.env.OPENAIQ_API_SPEC_URL ?? 'https://raw.githubusercontent.com/open-aiq/backend/main/docs/swagger.yaml'
const local = (await readFile('src/assets/openapi/swagger.yaml', 'utf8')).replace(/\r\n/g, '\n').trimEnd()
const response = await fetch(upstream)
if (!response.ok) throw new Error(`Unable to download ${upstream}: HTTP ${response.status}`)
const remote = (await response.text()).replace(/\r\n/g, '\n').trimEnd()

if (local !== remote) {
  console.error('The committed API snapshot differs from open-aiq/backend main.')
  console.error('Run: npm run sync:api -- ../backend/docs/swagger.yaml')
  process.exit(1)
}
console.log('API snapshot matches open-aiq/backend main.')
