import { useEffect, useState } from 'react'
import { fetchAnalytics } from './api'
import type { Analytics, AsyncState } from './types'

function App() {
  const [state, setState] = useState<AsyncState<Analytics>>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetchAnalytics()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      })

    return () => {
      cancelled = true
    }
  }, [])

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
        </main>
      )
    case 'success': {
      const { overview, confidence_distribution } = state.data
      return (
        <main>
          <h1>SAPA Dashboard</h1>
          <p>
            {overview.total_topics} topics tracked · streak {overview.current_streak} /{' '}
            {overview.longest_streak} · {overview.due_reviews} due for review
          </p>
          <p>
            Mastered {confidence_distribution.mastered} · Strong {confidence_distribution.strong}{' '}
            · Learning {confidence_distribution.learning} · Weak {confidence_distribution.weak}
          </p>
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
