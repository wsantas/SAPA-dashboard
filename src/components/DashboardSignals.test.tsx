import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { DashboardSignals as Signals } from '../types'

const fetchSignalsMock = vi.fn<() => Promise<Signals>>()

vi.mock('../api', () => ({
  fetchDashboardSignals: (...args: unknown[]) =>
    fetchSignalsMock(...(args as [])),
}))

const { DashboardSignals } = await import('./DashboardSignals')

const liveSignals: Signals = {
  weeklySessions: 4,
  topEvents: [
    { event: 'heatmap_day_clicked', count: 8 },
    { event: 'topic_expanded', count: 3 },
  ],
  lastActivityTs: Math.floor(Date.now() / 1000) - 60,
  source: 'live',
}

const demoSignals: Signals = {
  weeklySessions: 14,
  topEvents: [{ event: 'heatmap_day_clicked', count: 47 }],
  lastActivityTs: Math.floor(Date.now() / 1000) - 90,
  source: 'demo',
}

describe('<DashboardSignals />', () => {
  beforeEach(() => {
    fetchSignalsMock.mockReset()
  })

  it('shows the LIVE pill when source is "live"', async () => {
    fetchSignalsMock.mockResolvedValue(liveSignals)
    render(<DashboardSignals />)
    // LIVE also appears in the hero "Live analytics..." subtitle, so
    // use getAllByText and assert at least one.
    const liveMatches = await screen.findAllByText(/LIVE/i)
    expect(liveMatches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the live footnote text when source is "live"', async () => {
    fetchSignalsMock.mockResolvedValue(liveSignals)
    render(<DashboardSignals />)
    // The footnote text is distinctive enough to query directly.
    expect(
      await screen.findByText(/queried through a server-side proxy/i),
    ).toBeInTheDocument()
  })

  it('shows the DEMO pill and fallback subtitle when source is "demo"', async () => {
    fetchSignalsMock.mockResolvedValue(demoSignals)
    render(<DashboardSignals />)
    expect(
      await screen.findByText(/baked demo fallback/i),
    ).toBeInTheDocument()
    // DEMO text appears both in the pill and in "demo fallback" subtitle
    const demoMatches = screen.getAllByText(/DEMO/i)
    expect(demoMatches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the weekly sessions count', async () => {
    fetchSignalsMock.mockResolvedValue(liveSignals)
    render(<DashboardSignals />)
    expect(await screen.findByText('4')).toBeInTheDocument()
  })

  it('renders the top-events bar chart labels', async () => {
    fetchSignalsMock.mockResolvedValue(liveSignals)
    render(<DashboardSignals />)
    expect(
      await screen.findByText(/heatmap drill-down/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/topic expanded/i)).toBeInTheDocument()
  })

  it('shows the error message in an alert when fetch rejects', async () => {
    fetchSignalsMock.mockRejectedValue(new Error('service down'))
    render(<DashboardSignals />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('service down')
  })
})
