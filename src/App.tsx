import { useCallback, useEffect, useRef, useState } from 'react'
import type { Analytics, AsyncState, DemoScenarioId, Profile } from './types'
import { DEMO_MODE, fetchAnalytics, fetchProfiles, setActiveProfileId } from './api'
import { trackEvent } from './analytics'
import { useAsyncData } from './useAsyncData'
import { useActiveScenario } from './useActiveScenario'
import { useFeatureFlag } from './useFeatureFlag'
import { useWebSocket } from './useWebSocket'
import type { WsEvent } from './useWebSocket'
import { StreakCard } from './components/StreakCard'
import { ConfidenceBreakdown } from './components/ConfidenceBreakdown'
import { DueReviewsList } from './components/DueReviewsList'
import { WeeklyActivityChart } from './components/WeeklyActivityChart'
import { ActivityHeatmap } from './components/ActivityHeatmap'
import { TopicsExplorer } from './components/TopicsExplorer'
import { InsightsCard } from './components/InsightsCard'
import { UsageAnalytics } from './components/UsageAnalytics'
import { DashboardSignals } from './components/DashboardSignals'
import { AutomationsWidget } from './components/AutomationsWidget'
import { LiveToast } from './components/LiveToast'
import { ProfileSwitcher } from './components/ProfileSwitcher'
import { ScenarioPicker } from './components/ScenarioPicker'
import { ErrorBoundary } from './components/ErrorBoundary'
import styles from './App.module.css'

function App() {
  const [profiles, setProfiles] = useState<readonly Profile[]>([])
  const [activeProfile, setActiveProfile] = useState<number>(1)
  const { state, refetch } = useAsyncData(fetchAnalytics)
  const { lastEvent, connected } = useWebSocket()
  const { scenario, scenarioId, setScenario } = useActiveScenario()

  useEffect(() => {
    if (DEMO_MODE) return
    fetchProfiles().then(setProfiles).catch(() => {})
  }, [])

  const handleProfileSwitch = useCallback(
    (id: number) => {
      setActiveProfileId(id)
      setActiveProfile(id)
      trackEvent('profile_switched', { profile_id: id })
      refetch()
    },
    [refetch],
  )

  const handleScenarioSwitch = useCallback(
    (id: DemoScenarioId) => {
      setScenario(id)
      refetch()
    },
    [refetch, setScenario],
  )

  const handleRefresh = useCallback(() => {
    trackEvent('refresh_clicked')
    refetch()
  }, [refetch])

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

  // In demo mode, the profile identity comes from the active scenario;
  // in live mode, the user picks via ProfileSwitcher.
  const displayedProfile = DEMO_MODE ? scenario.profile.display_name : null
  const remountKey = DEMO_MODE ? scenarioId : activeProfile

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
            <p className={styles.subtitle}>
              {displayedProfile
                ? `${displayedProfile} · spaced-repetition analytics`
                : 'Spaced-repetition analytics'}
            </p>
          </div>
          <div className={styles.headerActions}>
            {DEMO_MODE ? (
              <ScenarioPicker
                activeId={scenarioId}
                onSwitch={handleScenarioSwitch}
              />
            ) : (
              profiles.length > 1 && (
                <ProfileSwitcher
                  profiles={profiles}
                  activeId={activeProfile}
                  onSwitch={handleProfileSwitch}
                />
              )
            )}
            <button type="button" className={styles.button} onClick={handleRefresh}>
              Refresh
            </button>
          </div>
        </header>
        <main>
          <Body state={state} remountKey={remountKey} />
        </main>
      </div>
      <LiveToast event={lastEvent} />
    </div>
  )
}

function Body({
  state,
  remountKey,
}: {
  state: AsyncState<Analytics>
  remountKey: string | number
}) {
  // Default is "on" — the flag exists so it can be flipped off from
  // PostHog's dashboard during a demo without redeploying.
  const showAiInsights = useFeatureFlag('show_ai_insights', true)

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
        <div className={styles.grid} key={remountKey}>
          <ErrorBoundary label="Streak">
            <StreakCard overview={overview} />
          </ErrorBoundary>
          <ErrorBoundary label="Confidence">
            <ConfidenceBreakdown distribution={confidence_distribution} />
          </ErrorBoundary>
          <ErrorBoundary label="Due Reviews">
            <DueReviewsList reviews={due_reviews} />
          </ErrorBoundary>
          <ErrorBoundary label="Weekly Activity">
            <WeeklyActivityChart weeks={weekly_totals} />
          </ErrorBoundary>
          <ErrorBoundary label="Activity Heatmap">
            <ActivityHeatmap dailyActivity={daily_activity} />
          </ErrorBoundary>
          <ErrorBoundary label="Automations">
            <AutomationsWidget analytics={state.data} />
          </ErrorBoundary>
          <ErrorBoundary label="Topics">
            <TopicsExplorer />
          </ErrorBoundary>
          {showAiInsights && (
            <ErrorBoundary label="AI Insights">
              <InsightsCard />
            </ErrorBoundary>
          )}
          <ErrorBoundary label="Dashboard Analytics">
            <UsageAnalytics />
          </ErrorBoundary>
          <ErrorBoundary label="Dashboard Signals">
            <DashboardSignals />
          </ErrorBoundary>
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
