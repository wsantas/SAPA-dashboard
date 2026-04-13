import { z } from 'zod'
import { AnalyticsSchema, type Analytics } from './types'

const API_BASE = 'http://localhost:8002'

export async function fetchAnalytics(): Promise<Analytics> {
  const response = await fetch(`${API_BASE}/api/analytics`)
  if (!response.ok) {
    throw new Error(
      `GET /api/analytics failed: ${response.status} ${response.statusText}`,
    )
  }

  const raw: unknown = await response.json()
  const parsed = AnalyticsSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(
      `GET /api/analytics returned an invalid shape: ${z.prettifyError(parsed.error)}`,
    )
  }
  return parsed.data
}
