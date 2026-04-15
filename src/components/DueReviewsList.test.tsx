import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DueReviewsList } from './DueReviewsList'
import type { Topic } from '../types'

const sampleTopics: readonly Topic[] = [
  {
    name: 'hyperventilation',
    first_learned: '2026-04-13T17:43:20.095781',
    last_reviewed: '2026-04-13T17:52:35.980409',
    review_count: 1,
    confidence_score: 0.7,
    next_review: '2026-04-16T17:52:35.980444',
  },
  {
    name: 'foam rolling',
    first_learned: '2026-04-13T16:16:33.037600',
    last_reviewed: '2026-04-13T17:52:35.972008',
    review_count: 4,
    confidence_score: 0.82,
    next_review: '2026-05-22T17:52:35.972042',
  },
]

describe('<DueReviewsList />', () => {
  it('renders an empty-state message when the reviews array is empty', () => {
    render(<DueReviewsList reviews={[]} />)
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('renders one list item per topic when given reviews', () => {
    render(<DueReviewsList reviews={sampleTopics} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(screen.getByText('hyperventilation')).toBeInTheDocument()
    expect(screen.getByText('foam rolling')).toBeInTheDocument()
  })

  it('includes the review count in the heading when non-empty', () => {
    render(<DueReviewsList reviews={sampleTopics} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.textContent).toMatch(/2/)
  })

  it('omits the count suffix in the heading when empty', () => {
    render(<DueReviewsList reviews={[]} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.textContent).not.toMatch(/·/)
  })
})
