import type { Analytics, AsyncState } from './types'
import { DEMO_MODE, fetchAnalytics } from './api'
import { useAsyncData } from './useAsyncData'
import { StreakCard } from './components/StreakCard'
import { ConfidenceBreakdown } from './components/ConfidenceBreakdown'
import { DueReviewsList } from './components/DueReviewsList'
import { WeeklyActivityChart } from './components/WeeklyActivityChart'
import { TopicsExplorer } from './components/TopicsExplorer'
import { InsightsCard } from './components/InsightsCard'
import styles from './App.module.css'

function App() {
  const { state, refetch } = useAsyncData(fetchAnalytics)

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
      const { overview, confidence_distribution, due_reviews, weekly_totals } =
        state.data
      return (
        <div className={styles.grid}>
          <StreakCard overview={overview} />
          <ConfidenceBreakdown distribution={confidence_distribution} />
          <DueReviewsList reviews={due_reviews} />
          <WeeklyActivityChart weeks={weekly_totals} />
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
