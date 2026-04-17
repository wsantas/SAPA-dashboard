import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'

// Mock posthog so trackEvent doesn't try to send to network
vi.mock('posthog-js', () => ({
  default: { __loaded: false, capture: vi.fn() },
}))

describe('<UsageAnalytics />', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders an empty-state message when no events have been tracked', async () => {
    const { UsageAnalytics } = await import('./UsageAnalytics')
    render(<UsageAnalytics />)
    expect(screen.getByText(/interact with the dashboard/i)).toBeInTheDocument()
  })

  it('shows the session timer and event stats', async () => {
    const { UsageAnalytics } = await import('./UsageAnalytics')
    render(<UsageAnalytics />)
    expect(screen.getByText(/interactions$/i)).toBeInTheDocument()
    expect(screen.getByText(/event types$/i)).toBeInTheDocument()
    expect(screen.getByText(/session time$/i)).toBeInTheDocument()
  })

  it('re-renders when a new event is tracked (useSyncExternalStore subscription)', async () => {
    const analytics = await import('../analytics')
    const { UsageAnalytics } = await import('./UsageAnalytics')

    render(<UsageAnalytics />)

    expect(
      screen.getByText(/interact with the dashboard/i),
    ).toBeInTheDocument()

    act(() => {
      analytics.trackEvent('refresh_clicked')
    })

    // Empty state replaced by event log + breakdown
    expect(
      screen.queryByText(/interact with the dashboard/i),
    ).not.toBeInTheDocument()

    // "Refresh" label appears in both breakdown and log — getAllByText
    const refreshMatches = screen.getAllByText('Refresh')
    expect(refreshMatches.length).toBeGreaterThanOrEqual(1)
  })

  it('groups events by type in the breakdown', async () => {
    const analytics = await import('../analytics')
    const { UsageAnalytics } = await import('./UsageAnalytics')

    render(<UsageAnalytics />)

    act(() => {
      analytics.trackEvent('heatmap_day_clicked')
      analytics.trackEvent('heatmap_day_clicked')
      analytics.trackEvent('topic_expanded')
    })

    // Both labels render in the breakdown. They ALSO render in the event
    // log, so getAllByText is the right query.
    expect(screen.getAllByText(/heatmap drill-down/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/topic expanded/i).length).toBeGreaterThanOrEqual(1)
  })
})
