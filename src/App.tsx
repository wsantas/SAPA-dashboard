import { fetchAnalytics } from './api'
import { useAsyncData } from './useAsyncData'
import { StreakCard } from './components/StreakCard'
import { ConfidenceBreakdown } from './components/ConfidenceBreakdown'
import { DueReviewsList } from './components/DueReviewsList'

function App() {
  const { state, refetch } = useAsyncData(fetchAnalytics)

  switch (state.status) {
    case 'idle':
      return (
        <main>
          <h1>SAPA Dashboard</h1>
          <p>Idle.</p>
        </main>
      )
    case 'loading':
      return (
        <main>
          <h1>SAPA Dashboard</h1>
          <p>Loading analytics…</p>
        </main>
      )
    case 'error':
      return (
        <main>
          <h1>SAPA Dashboard</h1>
          <p role="alert">Error: {state.error.message}</p>
          <button type="button" onClick={refetch}>
            Retry
          </button>
        </main>
      )
    case 'success': {
      const { overview, confidence_distribution, due_reviews } = state.data
      return (
        <main>
          <h1>SAPA Dashboard</h1>
          <StreakCard overview={overview} />
          <ConfidenceBreakdown distribution={confidence_distribution} />
          <DueReviewsList reviews={due_reviews} />
          <button type="button" onClick={refetch}>
            Refresh
          </button>
        </main>
      )
    }
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}

export default App
