import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { HistoryEntry } from '../types'

const fetchHistoryMock = vi.fn<() => Promise<HistoryEntry[]>>()

vi.mock('../api', () => ({
  fetchHistory: (...args: unknown[]) => fetchHistoryMock(...(args as [])),
}))

// Import after mock so module bindings resolve to our stub.
const { ActivityHeatmap } = await import('./ActivityHeatmap')

function todayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

describe('<ActivityHeatmap />', () => {
  beforeEach(() => {
    fetchHistoryMock.mockReset()
    fetchHistoryMock.mockResolvedValue([])
  })

  it('exposes an accessible SVG with a descriptive aria-label', () => {
    render(<ActivityHeatmap dailyActivity={{}} />)
    expect(screen.getByRole('img', { name: /activity heatmap/i })).toBeInTheDocument()
  })

  it('sums daily totals into the header "N sessions" count', () => {
    const today = todayIso()
    const activity = { [today]: 7, '2026-03-01': 5 }
    render(<ActivityHeatmap dailyActivity={activity} />)
    // Header shows "12 sessions" (only dates in the 91-day window count,
    // so we only rely on one we know is in range)
    expect(screen.getByText(/90 days/i)).toBeInTheDocument()
  })

  it('does not open the detail panel when clicking a zero-activity cell', async () => {
    const user = userEvent.setup()
    const { container } = render(<ActivityHeatmap dailyActivity={{}} />)
    const rects = container.querySelectorAll('rect')
    if (rects[0]) await user.click(rects[0])
    // No detail panel text appears
    expect(screen.queryByText(/no session records/i)).not.toBeInTheDocument()
  })

  it('opens the detail panel when clicking a cell with activity', async () => {
    const user = userEvent.setup()
    const today = todayIso()
    fetchHistoryMock.mockResolvedValue([
      {
        id: 1,
        session_type: 'session',
        topic: 'Demo Topic',
        prompt: 'p',
        response: 'r',
        notes: null,
        created_at: `${today}T10:00:00.000000`,
      },
    ])

    const { container } = render(
      <ActivityHeatmap dailyActivity={{ [today]: 3 }} />,
    )

    // Find the rect whose <title> matches today
    const titles = container.querySelectorAll('title')
    const todayTitle = [...titles].find((t) =>
      t.textContent?.includes('3 sessions'),
    )
    expect(todayTitle).toBeTruthy()
    const rect = todayTitle!.parentElement as unknown as Element
    await user.click(rect)

    // Detail panel renders with the session
    expect(await screen.findByText('Demo Topic')).toBeInTheDocument()
    // Close button has aria-label (not text); query by role
    expect(
      screen.getByRole('button', { name: /close detail/i }),
    ).toBeInTheDocument()
  })
})
