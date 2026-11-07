// Roadmap progress, built from GitHub issues labelled `phase:N` across the
// open-aiq organisation. The board (src/data/roadmap.json `board`) mirrors
// these labels in its Phase field.
//
// An issue counts as done when closed; an open issue with sub-issues counts
// for the share of its sub-issues that are closed. Each phase lists friendly
// groups (from roadmap.json) whose progress is the mean of their issues. The
// phase's own progress covers every labelled issue, grouped or not. If GitHub
// is unreachable the phases are still returned, with `progress: null`.
import roadmap from '../data/roadmap.json'

export type RoadmapGroup = {
  title: string
  progress: number | null
  done: number
  total: number
}

export type RoadmapPhase = {
  id: number
  title: string
  persona: string
  who: string
  summary: string
  url: string
  status: 'complete' | 'current' | 'planned'
  progress: number | null
  groups: RoadmapGroup[]
}

export type Roadmap = {
  board: string
  updatedAt: string
  progress: number | null
  done: number
  total: number
  phases: RoadmapPhase[]
}

type SearchItem = {
  number: number
  state: 'open' | 'closed'
  repository_url: string
  sub_issues_summary?: { completed: number; total: number }
}

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'open-aiq-docs',
}
const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN
if (token) headers.Authorization = `Bearer ${token}`

async function phaseIssues(label: string): Promise<SearchItem[] | null> {
  const q = encodeURIComponent(`org:${roadmap.org} is:issue label:"${label}"`)
  try {
    const response = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=100`, { headers })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const { items } = (await response.json()) as { items: SearchItem[] }
    return items
  } catch (error) {
    console.warn(`[roadmap] could not load ${label} issues: ${error}`)
    return null
  }
}

// "app#16" for an issue from the search results.
const refOf = (issue: SearchItem) => `${issue.repository_url.split('/').pop()}#${issue.number}`

function progressOf(issue: SearchItem): number {
  if (issue.state === 'closed') return 1
  const sub = issue.sub_issues_summary
  return sub && sub.total > 0 ? sub.completed / sub.total : 0
}

const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0)

// The phase filtered on the board.
const phaseUrl = (label: string) => `${roadmap.board}?filterQuery=${encodeURIComponent(`label:${label}`)}`

let cached: Promise<Roadmap> | undefined

async function build(): Promise<Roadmap> {
  const results = await Promise.all(roadmap.phases.map((phase) => phaseIssues(phase.label)))
  let currentFound = false
  const phases: RoadmapPhase[] = roadmap.phases.map((phase, index) => {
    const issues = results[index]
    const byRef = new Map((issues ?? []).map((issue) => [refOf(issue), issue]))
    const groups = phase.groups.map((group) => {
      const found = group.issues.map((ref) => byRef.get(ref)).filter((issue) => issue !== undefined)
      return {
        title: group.title,
        progress: issues && found.length ? mean(found.map(progressOf)) : issues ? 0 : null,
        done: found.filter((issue) => issue.state === 'closed').length,
        total: group.issues.length,
      }
    })
    const progress = issues ? mean(issues.map(progressOf)) : null
    const complete = progress !== null && issues!.length > 0 && progress >= 1
    let status: RoadmapPhase['status'] = 'planned'
    if (complete) status = 'complete'
    else if (!currentFound) {
      status = 'current'
      currentFound = true
    }
    return { id: phase.id, title: phase.title, persona: phase.persona, who: phase.who, summary: phase.summary, url: phaseUrl(phase.label), status, progress, groups }
  })
  const reachable = results.every((issues) => issues !== null)
  const allIssues = results.flatMap((issues) => issues ?? [])
  return {
    board: roadmap.board,
    updatedAt: new Date().toISOString(),
    progress: reachable ? mean(allIssues.map(progressOf)) : null,
    done: allIssues.filter((issue) => issue.state === 'closed').length,
    total: allIssues.length,
    phases,
  }
}

// One GitHub round-trip per build, shared by the page and /roadmap.json.
export function loadRoadmap(): Promise<Roadmap> {
  cached ??= build()
  return cached
}
