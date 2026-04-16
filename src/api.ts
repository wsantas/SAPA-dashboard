import { z } from 'zod'
import {
  AnalyticsSchema,
  HistoryEntrySchema,
  InsightsResponseSchema,
  ProfileSchema,
  TopicSchema,
  type Analytics,
  type HistoryEntry,
  type InsightsResponse,
  type Profile,
  type Topic,
} from './types'
import {
  DEFAULT_DEMO_PROFILE_ID,
  demoDataByProfile,
  demoProfiles,
  type ProfileDemoData,
} from './demo'

const TopicsSchema = z.array(TopicSchema)
const ProfilesSchema = z.array(ProfileSchema)
const HistorySchema = z.array(HistoryEntrySchema)

const API_BASE: string =
  import.meta.env['VITE_API_BASE'] ?? 'http://localhost:8002'

export const DEMO_MODE: boolean =
  import.meta.env['VITE_DEMO_MODE'] === 'true'

let _activeProfileId = DEFAULT_DEMO_PROFILE_ID

export function setActiveProfileId(id: number): void {
  _activeProfileId = id
  document.cookie = `profile_id=${id}; path=/; SameSite=Lax`
}

function getDemoBundle(): ProfileDemoData {
  return (
    demoDataByProfile[_activeProfileId] ??
    demoDataByProfile[DEFAULT_DEMO_PROFILE_ID]!
  )
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
  if (DEMO_MODE) return simulateNetwork(getDemoBundle().analytics)
  return apiGet('/api/analytics', AnalyticsSchema)
}

export function fetchTopics(): Promise<Topic[]> {
  if (DEMO_MODE) return simulateNetwork([...getDemoBundle().topics])
  return apiGet('/api/topics', TopicsSchema)
}

export function fetchHistory(): Promise<HistoryEntry[]> {
  if (DEMO_MODE) return simulateNetwork([...getDemoBundle().history])
  return apiGet('/api/history?limit=200', HistorySchema)
}

export function fetchInsights(): Promise<InsightsResponse> {
  if (DEMO_MODE) return simulateNetwork(getDemoBundle().insights, 1200)
  return apiPost('/api/ai/insights', InsightsResponseSchema)
}
