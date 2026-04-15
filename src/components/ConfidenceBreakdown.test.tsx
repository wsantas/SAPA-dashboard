import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConfidenceBreakdown } from './ConfidenceBreakdown'
import type { ConfidenceDistribution } from '../types'

describe('<ConfidenceBreakdown />', () => {
  it('renders all four bucket labels and their counts', () => {
    const distribution: ConfidenceDistribution = {
      mastered: 18,
      strong: 71,
      learning: 0,
      weak: 0,
    }
    render(<ConfidenceBreakdown distribution={distribution} />)

    expect(screen.getByText('Mastered')).toBeInTheDocument()
    expect(screen.getByText('Strong')).toBeInTheDocument()
    expect(screen.getByText('Learning')).toBeInTheDocument()
    expect(screen.getByText('Weak')).toBeInTheDocument()

    // Mastered: 18 of 89 total = 20%
    expect(screen.getByText('18 · 20%')).toBeInTheDocument()
    // Strong: 71 of 89 total = 80% (79.78 rounds to 80)
    expect(screen.getByText('71 · 80%')).toBeInTheDocument()
  })

  it('renders the caption with the total topic count', () => {
    const distribution: ConfidenceDistribution = {
      mastered: 5,
      strong: 10,
      learning: 3,
      weak: 2,
    }
    render(<ConfidenceBreakdown distribution={distribution} />)
    expect(screen.getByText('20 topics')).toBeInTheDocument()
  })

  it('renders 0% for every bucket when total is zero, without NaN', () => {
    const distribution: ConfidenceDistribution = {
      mastered: 0,
      strong: 0,
      learning: 0,
      weak: 0,
    }
    render(<ConfidenceBreakdown distribution={distribution} />)
    const zeros = screen.getAllByText('0 · 0%')
    expect(zeros).toHaveLength(4)
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
  })
})
