import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StreakCard } from './StreakCard'
import type { Overview } from '../types'

const baseOverview: Overview = {
  total_topics: 89,
  total_sessions: 2,
  current_streak: 7,
  longest_streak: 21,
  this_week: 12,
  due_reviews: 0,
}

describe('<StreakCard />', () => {
  it('renders all four stats from the overview prop', () => {
    render(<StreakCard overview={baseOverview} />)
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('21')).toBeInTheDocument()
    expect(screen.getByText('89')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('has a labelled section heading for accessibility', () => {
    render(<StreakCard overview={baseOverview} />)
    const section = screen.getByRole('region', { name: /streak/i })
    expect(section).toBeInTheDocument()
  })

  it('handles a zero-streak overview without crashing', () => {
    const zeroed: Overview = {
      ...baseOverview,
      current_streak: 0,
      longest_streak: 0,
      total_topics: 0,
      this_week: 0,
    }
    render(<StreakCard overview={zeroed} />)
    expect(screen.getAllByText('0')).toHaveLength(4)
  })
})
