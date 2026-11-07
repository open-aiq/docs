// Serves roadmap progress at https://docs.air-iq.net/roadmap.json so other
// Open AIQ sites can show it. Refreshed on every docs build.
import { loadRoadmap } from '../lib/roadmap'

export async function GET() {
  return new Response(JSON.stringify(await loadRoadmap(), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
