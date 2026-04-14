import { fetchAnalytics } from './api'
import { useAsyncData } from './useAsyncData'

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
      const { overview, confidence_distribution } = state.data
      return (
        <main>
          <h1>SAPA Dashboard</h1>
          <p>
            {overview.total_topics} topics tracked · streak{' '}
            {overview.current_streak} / {overview.longest_streak} ·{' '}
            {overview.due_reviews} due for review
          </p>
          <p>
            Mastered {confidence_distribution.mastered} · Strong{' '}
            {confidence_distribution.strong} · Learning{' '}
            {confidence_distribution.learning} · Weak{' '}
            {confidence_distribution.weak}
          </p>
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
