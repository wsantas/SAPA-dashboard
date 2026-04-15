import { z } from 'zod'
import {
  AnalyticsSchema,
  InsightsResponseSchema,
  TopicSchema,
  type Analytics,
  type InsightsResponse,
  type Topic,
} from './types'
import { demoAnalytics, demoInsights } from './demo'

const TopicsSchema = z.array(TopicSchema)

const API_BASE: string = import.meta.env['VITE_API_BASE'] ?? 'http://localhost:8002'

export const DEMO_MODE: boolean = import.meta.env['VITE_DEMO_MODE'] === 'true'

function simulateNetwork<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

async function apiGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
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

export function fetchAnalytics(): Promise<Analytics> {
  if (DEMO_MODE) return simulateNetwork(demoAnalytics)
  return apiGet('/api/analytics', AnalyticsSchema)
}

export function fetchTopics(): Promise<Topic[]> {
  if (DEMO_MODE) return simulateNetwork(demoAnalytics.topics as Topic[])
  return apiGet('/api/topics', TopicsSchema)
}

export function fetchInsights(): Promise<InsightsResponse> {
  if (DEMO_MODE) return simulateNetwork(demoInsights, 1200)
  return apiPost('/api/ai/insights', InsightsResponseSchema)
}
