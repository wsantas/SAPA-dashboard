import { useEffect, useState } from 'react'
import { fetchDashboardSignals } from '../api'
import { trackEvent } from '../analytics'
import { useAsyncData } from '../useAsyncData'
import type { DashboardSignals as Signals } from '../types'
import styles from './Card.module.css'
import signalStyles from './DashboardSignals.module.css'

const EVENT_LABELS: Record<string, string> = {
  refresh_clicked: 'Refresh',
  profile_switched: 'Profile switch',
  heatmap_day_clicked: 'Heatmap drill-down',
  topic_expanded: 'Topic expanded',
  insights_generated: 'AI Insights',
  insights_regenerated: 'AI Insights (regen)',
}

function formatRelative(fromTs: number, nowMs: number): string {
  const diffSec = Math.max(0, Math.floor(nowMs / 1000) - fromTs)
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  return `${Math.floor(diffSec / 86400)}d ago`
}

const POLL_INTERVAL_MS = 20_000

export function DashboardSignals() {
  const { state, refetch, silentRefetch } = useAsyncData(fetchDashboardSignals)
  const [now, setNow] = useState(() => Date.now())

  // Tick every 5s so "last activity: Ns ago" stays live without
  // refetching the underlying data.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(id)
  }, [])

  // Poll PostHog every 20s silently — stale-while-revalidate so the
  // widget feels live without flashing "loading" every cycle. Explicit
  // Refresh button still uses refetch() which shows the loading state.
  useEffect(() => {
    const id = setInterval(silentRefetch, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [silentRefetch])

  function handleRefresh() {
    trackEvent('signals_refreshed')
    refetch()
  }

  return (
    <section
      className={`${styles.card} ${signalStyles.signalsCard}`}
      aria-labelledby="signals-heading"
    >
      <div className={signalStyles.header}>
        <div>
          <div className={signalStyles.titleRow}>
            <h2 id="signals-heading" className={styles.heading}>
              Dashboard Signals
            </h2>
            {state.status === 'success' &&
              (state.data.source === 'live' ? (
                <span className={signalStyles.livePill}>
                  <span className={signalStyles.liveDot} />
                  LIVE
                </span>
              ) : (
                <span className={signalStyles.demoPill}>DEMO</span>
              ))}
          </div>
          <p className={signalStyles.subtitle}>
            {state.status === 'success' && state.data.source === 'demo'
              ? 'Baked demo fallback — PostHog proxy not reachable or unconfigured'
              : 'Live analytics of this dashboard, via PostHog HogQL'}
          </p>
        </div>
        <button
          type="button"
          className={signalStyles.refresh}
          onClick={handleRefresh}
          disabled={state.status === 'loading'}
        >
          {state.status === 'loading' ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <SignalsBody state={state} now={now} />
    </section>
  )
}

function SignalsBody({
  state,
  now,
}: {
  state: ReturnType<typeof useAsyncData<Signals>>['state']
  now: number
}) {
  switch (state.status) {
    case 'idle':
      return null
    case 'loading':
      return <p className={signalStyles.placeholder}>Querying PostHog…</p>
    case 'error':
      return (
        <p className={signalStyles.error} role="alert">
          {state.error.message}
        </p>
      )
    case 'success': {
      const { weeklySessions, topEvents, lastActivityTs } = state.data
      const maxCount = topEvents[0]?.count ?? 0
      return (
        <>
          <div className={signalStyles.statsRow}>
            <div className={signalStyles.stat}>
              <span className={signalStyles.statValue}>{weeklySessions}</span>
              <span className={signalStyles.statLabel}>
                sessions · last 7 days
              </span>
            </div>
            <div className={signalStyles.stat}>
              <span className={signalStyles.statValue}>
                {lastActivityTs === null
                  ? '—'
                  : formatRelative(lastActivityTs, now)}
              </span>
              <span className={signalStyles.statLabel}>last activity</span>
            </div>
            <div className={signalStyles.stat}>
              <span className={signalStyles.statValue}>{topEvents.length}</span>
              <span className={signalStyles.statLabel}>
                event types · last 7 days
              </span>
            </div>
          </div>

          {topEvents.length > 0 && (
            <div className={signalStyles.breakdown}>
              <h3 className={signalStyles.subheading}>Top events (7 days)</h3>
              <div className={signalStyles.bars}>
                {topEvents.map(({ event, count }) => (
                  <div key={event} className={signalStyles.barRow}>
                    <span className={signalStyles.barLabel}>
                      {EVENT_LABELS[event] ?? event}
                    </span>
                    <div className={signalStyles.barTrack}>
                      <div
                        className={signalStyles.barFill}
                        style={{
                          width: `${maxCount === 0 ? 0 : (count / maxCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={signalStyles.barCount}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className={signalStyles.footnote}>
            {state.data.source === 'live'
              ? 'Live HogQL · queried through a server-side proxy so the personal API key never ships to the browser'
              : 'Demo fallback · set POSTHOG_PERSONAL_API_KEY + POSTHOG_PROJECT_ID in Vercel env vars to flip this widget to real HogQL data'}
          </p>
        </>
      )
    }
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
