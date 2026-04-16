import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * PostHog HogQL query proxy.
 *
 * The personal API key (`phx_...`) is server-side only — it MUST NOT ship
 * in the browser bundle, because it grants read access to the entire
 * project. We only accept queryId values from a hardcoded allow-list so
 * visitors can't run arbitrary HogQL through this endpoint.
 *
 * Environment:
 *   POSTHOG_PERSONAL_API_KEY  — required, secret, scoped to Query read
 *   POSTHOG_PROJECT_ID        — required, numeric id from Project Settings
 *   POSTHOG_HOST              — optional, defaults to https://us.posthog.com
 */

type QueryId = 'weekly_sessions' | 'top_events' | 'last_activity'

const QUERIES: Record<QueryId, string> = {
  weekly_sessions: `
    SELECT count(DISTINCT $session_id) AS sessions
    FROM events
    WHERE timestamp > now() - INTERVAL 7 DAY
      AND notEmpty($session_id)
  `,
  top_events: `
    SELECT event, count() AS c
    FROM events
    WHERE event IN (
      'refresh_clicked', 'profile_switched', 'heatmap_day_clicked',
      'topic_expanded', 'insights_generated', 'insights_regenerated'
    )
      AND timestamp > now() - INTERVAL 7 DAY
    GROUP BY event
    ORDER BY c DESC
    LIMIT 5
  `,
  last_activity: `
    SELECT toUnixTimestamp(max(timestamp)) AS last_ts
    FROM events
    WHERE timestamp > now() - INTERVAL 30 DAY
  `,
}

function isQueryId(x: unknown): x is QueryId {
  return typeof x === 'string' && x in QUERIES
}

function cors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  cors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env['POSTHOG_PERSONAL_API_KEY']
  const projectId = process.env['POSTHOG_PROJECT_ID']
  const host = process.env['POSTHOG_HOST'] ?? 'https://us.posthog.com'

  if (!apiKey || !projectId) {
    return res.status(503).json({
      error:
        'PostHog not configured (POSTHOG_PERSONAL_API_KEY or POSTHOG_PROJECT_ID missing)',
    })
  }

  const body =
    typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
  const queryId = body.queryId
  if (!isQueryId(queryId)) {
    return res.status(400).json({ error: `Unknown queryId: ${queryId}` })
  }

  const query = QUERIES[queryId]

  try {
    const phResponse = await fetch(
      `${host}/api/projects/${projectId}/query/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: { kind: 'HogQLQuery', query },
        }),
      },
    )

    if (!phResponse.ok) {
      const detail = await phResponse.text()
      return res.status(502).json({
        error: `PostHog query failed: ${phResponse.status}`,
        detail: detail.slice(0, 500),
      })
    }

    const data = await phResponse.json()
    return res.status(200).json({
      queryId,
      columns: Array.isArray(data.columns) ? data.columns : [],
      results: Array.isArray(data.results) ? data.results : [],
    })
  } catch (err) {
    return res.status(502).json({
      error: 'PostHog request failed',
      detail: err instanceof Error ? err.message : String(err),
    })
  }
}
