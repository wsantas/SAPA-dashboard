import { useEffect, useRef } from 'react'
import type { Analytics, AsyncState } from './types'
import { DEMO_MODE, fetchAnalytics } from './api'
import { useAsyncData } from './useAsyncData'
import { useWebSocket } from './useWebSocket'
import type { WsEvent } from './useWebSocket'
import { StreakCard } from './components/StreakCard'
import { ConfidenceBreakdown } from './components/ConfidenceBreakdown'
import { DueReviewsList } from './components/DueReviewsList'
import { WeeklyActivityChart } from './components/WeeklyActivityChart'
import { ActivityHeatmap } from './components/ActivityHeatmap'
import { TopicsExplorer } from './components/TopicsExplorer'
import { InsightsCard } from './components/InsightsCard'
import { LiveToast } from './components/LiveToast'
import styles from './App.module.css'

function App() {
  const { state, refetch } = useAsyncData(fetchAnalytics)
  const { lastEvent, connected } = useWebSocket()

  // Auto-refetch when a WebSocket event arrives and data is loaded
  const prevEventRef = useRef<WsEvent | null>(null)
  useEffect(() => {
    if (lastEvent && lastEvent !== prevEventRef.current && state.status === 'success') {
      refetch()
    }
    prevEventRef.current = lastEvent
  }, [lastEvent, state.status, refetch])

  return (
    <div className={styles.app}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.title}>
              <h1>SAPA Dashboard</h1>
              <span className={styles.badge}>
                <span className={styles.badgeDot} />
                {DEMO_MODE ? 'Demo' : 'Live'}
                {!DEMO_MODE && connected && (
                  <span className={styles.connectedDot} />
                )}
              </span>
            </div>
            <p className={styles.subtitle}>Spaced-repetition analytics</p>
          </div>
          <button type="button" className={styles.button} onClick={refetch}>
            Refresh
          </button>
        </header>
        <main>
          <Body state={state} />
        </main>
      </div>
      <LiveToast event={lastEvent} />
    </div>
  )
}

function Body({ state }: { state: AsyncState<Analytics> }) {
  switch (state.status) {
    case 'idle':
      return null
    case 'loading':
      return (
        <div className={styles.center}>
          <span className={styles.loadingDots} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <p className={styles.centerTitle}>Loading analytics…</p>
        </div>
      )
    case 'error':
      return (
        <div className={styles.center}>
          <p className={styles.errorTitle} role="alert">
            {state.error.message}
          </p>
        </div>
      )
    case 'success': {
      const {
        overview,
        confidence_distribution,
        due_reviews,
        weekly_totals,
        daily_activity,
      } = state.data
      return (
        <div className={styles.grid}>
          <StreakCard overview={overview} />
          <ConfidenceBreakdown distribution={confidence_distribution} />
          <DueReviewsList reviews={due_reviews} />
          <WeeklyActivityChart weeks={weekly_totals} />
          <ActivityHeatmap dailyActivity={daily_activity} />
          <TopicsExplorer />
          <InsightsCard />
        </div>
      )
    }
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}

export default App
