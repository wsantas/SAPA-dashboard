import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Topic } from '../types'

const fetchTopicsMock = vi.fn<() => Promise<Topic[]>>()

vi.mock('../api', () => ({
  fetchTopics: (...args: unknown[]) => fetchTopicsMock(...(args as [])),
}))

const { TopicsExplorer } = await import('./TopicsExplorer')

const sampleTopics: Topic[] = [
  {
    name: 'alpha',
    first_learned: '2026-04-01T10:00:00.000000',
    last_reviewed: '2026-04-10T10:00:00.000000',
    review_count: 2,
    confidence_score: 0.55,
    next_review: '2026-04-20T10:00:00.000000',
  },
  {
    name: 'beta',
    first_learned: '2026-04-05T10:00:00.000000',
    last_reviewed: '2026-04-12T10:00:00.000000',
    review_count: 5,
    confidence_score: 0.85,
    next_review: '2026-05-01T10:00:00.000000',
  },
  {
    name: 'gamma',
    first_learned: '2026-04-08T10:00:00.000000',
    last_reviewed: '2026-04-13T10:00:00.000000',
    review_count: 1,
    confidence_score: 0.3,
    next_review: '2026-04-15T10:00:00.000000',
  },
]

describe('<TopicsExplorer />', () => {
  beforeEach(() => {
    fetchTopicsMock.mockReset()
    fetchTopicsMock.mockResolvedValue(sampleTopics)
  })

  it('renders the topic count in the heading after fetch resolves', async () => {
    render(<TopicsExplorer />)
    expect(await screen.findByRole('heading', { name: /topics · 3/i })).toBeInTheDocument()
  })

  it('renders every topic as a row', async () => {
    render(<TopicsExplorer />)
    expect(await screen.findByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()
    expect(screen.getByText('gamma')).toBeInTheDocument()
  })

  it('sorts by review_count descending by default', async () => {
    render(<TopicsExplorer />)
    await screen.findByText('alpha')
    const rows = screen.getAllByRole('row')
    // Header row + 3 data rows. First data row should be "beta" (5 reviews).
    const firstDataRow = rows[1]
    expect(firstDataRow?.textContent).toContain('beta')
  })

  it('toggles sort direction when clicking the active column header', async () => {
    const user = userEvent.setup()
    render(<TopicsExplorer />)
    await screen.findByText('alpha')

    const reviewsHeader = screen.getByRole('button', { name: /reviews/i })
    await user.click(reviewsHeader)

    // After toggle, sort is ascending — first row is "gamma" (1 review)
    const rows = screen.getAllByRole('row')
    expect(rows[1]?.textContent).toContain('gamma')
  })

  it('expands a topic row when clicked, showing confidence details', async () => {
    const user = userEvent.setup()
    render(<TopicsExplorer />)
    await screen.findByText('alpha')

    const alphaRow = screen.getByText('alpha').closest('tr')!
    await user.click(alphaRow)

    // Expanded row shows the detail labels (unique to the expanded view)
    expect(screen.getByText(/first learned/i)).toBeInTheDocument()
    expect(screen.getByText(/review count/i)).toBeInTheDocument()
    expect(screen.getByText(/next review/i)).toBeInTheDocument()
    // "55%" appears in both the row's Confidence cell and the detail bar,
    // so checking at least one match is the right assertion here.
    expect(screen.getAllByText(/55%/).length).toBeGreaterThanOrEqual(1)
  })
})
