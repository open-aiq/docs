// Serves the version registry at https://docs.air-iq.net/versions.json.
// Release scripts in every Open AIQ repository fetch this file and refuse to
// release a major or minor version that is not registered here.
import registry from '../data/versions.json'

export function GET() {
  return new Response(JSON.stringify(registry, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
