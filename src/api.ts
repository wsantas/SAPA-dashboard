import { z } from 'zod'
import { AnalyticsSchema, type Analytics } from './types'

const API_BASE = 'http://localhost:8002'

async function apiGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(
      `GET ${path} failed: ${response.status} ${response.statusText}`,
    )
  }

  const raw: unknown = await response.json()
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(
      `GET ${path} returned an invalid shape: ${z.prettifyError(parsed.error)}`,
    )
  }
  return parsed.data
}

export function fetchAnalytics(): Promise<Analytics> {
  return apiGet('/api/analytics', AnalyticsSchema)
}
