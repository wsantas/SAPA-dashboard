import { z } from 'zod'
import {
  AnalyticsSchema,
  HistoryEntrySchema,
  InsightsResponseSchema,
  ProfileSchema,
  SignalsQueryResponseSchema,
  TopicSchema,
  type Analytics,
  type DashboardSignals,
  type HistoryEntry,
  type InsightsResponse,
  type Profile,
  type Topic,
} from './types'
import {
  DEFAULT_DEMO_PROFILE_ID,
  demoProfiles,
  demoSignals,
  type ProfileDemoData,
} from './demo'
import { getActiveScenarioId } from './scenarioStore'
import { demoScenarios } from './scenarios'

const TopicsSchema = z.array(TopicSchema)
const ProfilesSchema = z.array(ProfileSchema)
const HistorySchema = z.array(HistoryEntrySchema)

const API_BASE: string =
  import.meta.env['VITE_API_BASE'] ?? 'http://localhost:8002'

export const DEMO_MODE: boolean =
  import.meta.env['VITE_DEMO_MODE'] === 'true'

// Live-mode profile switching: SAPA's middleware reads the profile_id
// cookie, so all we need to do is set it. In demo mode, profile
// identity comes from the active scenario (see scenarios.ts) and this
// function is never called.
export function setActiveProfileId(id: number): void {
  document.cookie = `profile_id=${id}; path=/; SameSite=Lax`
}

// Kept for potential future use (e.g. an initial default in UI state)
// — silence the unused-value lint by re-exporting.
export { DEFAULT_DEMO_PROFILE_ID }

/**
 * In demo mode, all fetchers read from the currently-selected scenario
 * rather than the profile map. This gives visitors on the deployed
 * demo a set of hand-curated stories to explore (healthy, review-debt,
 * onboarding, power-user, burnout) via the ScenarioPicker. The
 * per-profile bundle (demoDataByProfile) is kept in demo.ts for the
 * scenarios to reuse as raw material.
 */
function getActiveScenarioBundle(): ProfileDemoData {
  const scenario = demoScenarios[getActiveScenarioId()]
  return {
    analytics: scenario.analytics,
    topics: scenario.topics,
    history: scenario.history,
    insights: scenario.insights,
  }
}

function simulateNetwork<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

async function apiGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error(
      `GET ${path} failed: ${response.status} ${response.statusText}`,
    )
  }
  const raw: unknown = await response.json()
  return parseOrThrow(path, schema, raw)
}

async function apiPost<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!response.ok) {
    let detail = ''
    try {
      const errBody = (await response.json()) as { detail?: unknown }
      if (typeof errBody.detail === 'string') detail = ` — ${errBody.detail}`
    } catch {
      // ignore; the response wasn't JSON
    }
    throw new Error(
      `POST ${path} failed: ${response.status} ${response.statusText}${detail}`,
    )
  }
  const raw: unknown = await response.json()
  return parseOrThrow(path, schema, raw)
}

function parseOrThrow<T>(path: string, schema: z.ZodType<T>, raw: unknown): T {
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(
      `${path} returned an invalid shape: ${z.prettifyError(parsed.error)}`,
    )
  }
  return parsed.data
}

export function fetchProfiles(): Promise<Profile[]> {
  if (DEMO_MODE) return simulateNetwork(demoProfiles)
  return apiGet('/api/profiles', ProfilesSchema)
}

export function fetchAnalytics(): Promise<Analytics> {
  if (DEMO_MODE) return simulateNetwork(getActiveScenarioBundle().analytics)
  return apiGet('/api/analytics', AnalyticsSchema)
}

export function fetchTopics(): Promise<Topic[]> {
  if (DEMO_MODE) return simulateNetwork([...getActiveScenarioBundle().topics])
  return apiGet('/api/topics', TopicsSchema)
}

export function fetchHistory(): Promise<HistoryEntry[]> {
  if (DEMO_MODE) return simulateNetwork([...getActiveScenarioBundle().history])
  return apiGet('/api/history?limit=200', HistorySchema)
}

export function fetchInsights(): Promise<InsightsResponse> {
  if (DEMO_MODE) return simulateNetwork(getActiveScenarioBundle().insights, 1200)
  return apiPost('/api/ai/insights', InsightsResponseSchema)
}

/**
 * Runs a single predefined HogQL query via the Vercel proxy function.
 * The actual query lives in /api/posthog-query.ts; the client only
 * specifies which predefined query to run by id.
 */
async function runHogQLQuery(
  queryId: string,
): Promise<readonly ReadonlyArray<unknown>[]> {
  const response = await fetch(`/api/posthog-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queryId }),
  })
  if (!response.ok) {
    let detail = ''
    try {
      const errBody = (await response.json()) as { error?: unknown }
      if (typeof errBody.error === 'string') detail = ` — ${errBody.error}`
    } catch {
      // ignore
    }
    throw new Error(
      `PostHog query ${queryId} failed: ${response.status} ${response.statusText}${detail}`,
    )
  }
  const raw: unknown = await response.json()
  const parsed = SignalsQueryResponseSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(
      `PostHog query ${queryId} returned invalid shape: ${z.prettifyError(parsed.error)}`,
    )
  }
  return parsed.data.results
}

export async function fetchDashboardSignals(): Promise<DashboardSignals> {
  // DashboardSignals talks to PostHog via the Vercel proxy function,
  // NOT to SAPA — so it isn't gated by VITE_DEMO_MODE. We always
  // attempt the real query and gracefully fall back to baked signals
  // on any failure (function not deployed, env vars missing, network,
  // PostHog down). That way the widget renders useful content in
  // every deployment scenario without a second env-var toggle.
  try {
    const [weeklyRes, topRes, lastRes] = await Promise.all([
      runHogQLQuery('weekly_sessions'),
      runHogQLQuery('top_events'),
      runHogQLQuery('last_activity'),
    ])

    const weeklySessions =
      typeof weeklyRes[0]?.[0] === 'number' ? weeklyRes[0][0] : 0

    const topEvents = topRes.flatMap((row) => {
      const event = row[0]
      const count = row[1]
      if (typeof event === 'string' && typeof count === 'number') {
        return [{ event, count }]
      }
      return []
    })

    const lastRaw = lastRes[0]?.[0]
    const lastActivityTs = typeof lastRaw === 'number' ? lastRaw : null

    return { weeklySessions, topEvents, lastActivityTs, source: 'live' }
  } catch (err) {
    console.warn('[signals] PostHog query failed; using baked signals:', err)
    return demoSignals
  }
}
