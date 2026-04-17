import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { InsightsResponse } from '../types'

const fetchInsightsMock = vi.fn<() => Promise<InsightsResponse>>()

vi.mock('../api', () => ({
  DEMO_MODE: false,
  fetchInsights: (...args: unknown[]) => fetchInsightsMock(...(args as [])),
}))

// Import *after* the mock so the module binding resolves to our stub.
const { InsightsCard } = await import('./InsightsCard')

const sampleResponse: InsightsResponse = {
  insights: [
    {
      title: 'Strong foundation',
      body: 'Zero weak topics means you can push into harder material.',
    },
    {
      title: 'Zero due reviews',
      body: 'Use the gap to add new material rather than grinding review cycles.',
    },
  ],
  model: 'claude-sonnet-4-20250514',
  generated_at: '2026-04-14T19:52:17.221791+00:00',
}

describe('<InsightsCard />', () => {
  beforeEach(() => {
    fetchInsightsMock.mockReset()
  })

  it('starts in idle state with a Generate button and a placeholder', () => {
    render(<InsightsCard />)
    expect(
      screen.getByRole('button', { name: /generate/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/ask claude/i)).toBeInTheDocument()
  })

  it('shows the generated insights after a successful fetch', async () => {
    fetchInsightsMock.mockResolvedValue(sampleResponse)
    render(<InsightsCard />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /generate/i }))

    expect(
      await screen.findByRole('heading', { name: /strong foundation/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /zero due reviews/i }),
    ).toBeInTheDocument()
    expect(fetchInsightsMock).toHaveBeenCalledOnce()
  })

  it('shows the error message in an alert when fetch rejects', async () => {
    fetchInsightsMock.mockRejectedValue(new Error('upstream AI unavailable'))
    render(<InsightsCard />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /generate/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('upstream AI unavailable')
  })

  it('button flips from Generate to Regenerate after success', async () => {
    fetchInsightsMock.mockResolvedValue(sampleResponse)
    render(<InsightsCard />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /generate/i }))
    await screen.findByRole('heading', { name: /strong foundation/i })

    expect(
      screen.getByRole('button', { name: /regenerate/i }),
    ).toBeInTheDocument()
  })
})
