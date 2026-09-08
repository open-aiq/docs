import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const source = process.argv[2]
if (!source) {
  console.error('Usage: npm run sync:api -- <path-to-backend/docs/swagger.yaml>')
  process.exit(2)
}

const destination = resolve('src/assets/openapi/swagger.yaml')
let contents
try {
  contents = await readFile(resolve(source), 'utf8')
} catch (error) {
  console.error(`Unable to read API specification: ${error.message}`)
  process.exit(1)
}

const normalized = `${contents.replace(/\r\n/g, '\n').trimEnd()}\n`
if (!/^swagger:\s*["']?2\.0["']?\s*$/m.test(normalized) || !/^paths:\s*$/m.test(normalized)) {
  console.error('Expected a Swagger 2.0 document containing a paths object.')
  process.exit(1)
}

await writeFile(destination, normalized)
console.log(`Synchronized ${destination} from ${resolve(source)}`)
