import { useCallback, useEffect, useRef, useState } from 'react'
import type { Analytics, AsyncState, Profile } from './types'
import { DEMO_MODE, fetchAnalytics, fetchProfiles, setActiveProfileId } from './api'
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
import { ProfileSwitcher } from './components/ProfileSwitcher'
import styles from './App.module.css'

function App() {
  const [profiles, setProfiles] = useState<readonly Profile[]>([])
  const [activeProfile, setActiveProfile] = useState<number>(1)
  const { state, refetch } = useAsyncData(fetchAnalytics)
  const { lastEvent, connected } = useWebSocket()

  useEffect(() => {
    fetchProfiles().then(setProfiles).catch(() => {})
  }, [])

  const handleProfileSwitch = useCallback(
    (id: number) => {
      setActiveProfileId(id)
      setActiveProfile(id)
      refetch()
    },
    [refetch],
  )

  const prevEventRef = useRef<WsEvent | null>(null)
  useEffect(() => {
    if (
      lastEvent &&
      lastEvent !== prevEventRef.current &&
      lastEvent.event !== 'connected' &&
      state.status === 'success'
    ) {
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
          <div className={styles.headerActions}>
            {profiles.length > 1 && (
              <ProfileSwitcher
                profiles={profiles}
                activeId={activeProfile}
                onSwitch={handleProfileSwitch}
              />
            )}
            <button type="button" className={styles.button} onClick={refetch}>
              Refresh
            </button>
          </div>
        </header>
        <main>
          <Body state={state} profileKey={activeProfile} />
        </main>
      </div>
      <LiveToast event={lastEvent} />
    </div>
  )
}

function Body({
  state,
  profileKey,
}: {
  state: AsyncState<Analytics>
  profileKey: number
}) {
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
        <div className={styles.grid} key={profileKey}>
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
