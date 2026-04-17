import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeeklyActivityChart } from './WeeklyActivityChart'
import type { WeeklyTotal } from '../types'

const weeks: WeeklyTotal[] = [
  { week: 'Feb 02', total: 3, current: false },
  { week: 'Feb 09', total: 7, current: false },
  { week: 'Feb 16', total: 14, current: false },
  { week: 'Feb 23', total: 12, current: false },
  { week: 'Mar 01', total: 25, current: false },
  { week: 'Mar 08', total: 30, current: false },
  { week: 'Mar 15', total: 45, current: false },
  { week: 'Mar 22', total: 40, current: false },
  { week: 'Mar 29', total: 50, current: false },
  { week: 'Apr 06', total: 89, current: false },
  { week: 'Apr 13', total: 55, current: false },
  { week: 'Apr 20', total: 42, current: true },
]

describe('<WeeklyActivityChart />', () => {
  it('exposes an accessible SVG with a descriptive aria-label', () => {
    render(<WeeklyActivityChart weeks={weeks} />)
    const svg = screen.getByRole('img', { name: /weekly activity/i })
    expect(svg).toBeInTheDocument()
  })

  it('shows the current week total in the summary row', () => {
    render(<WeeklyActivityChart weeks={weeks} />)
    // "This week" value comes from the week where current === true (42)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows the peak total across all weeks', () => {
    // Peak is 89 across the fixture; current week is 42
    render(<WeeklyActivityChart weeks={weeks} />)
    expect(screen.getByText('89')).toBeInTheDocument()
  })

  it('renders a tooltip-bearing title for every week', () => {
    const { container } = render(<WeeklyActivityChart weeks={weeks} />)
    // SVG <title> elements — one per bar
    const titles = container.querySelectorAll('title')
    expect(titles.length).toBe(weeks.length)
  })

  it('handles an empty weeks array without crashing', () => {
    expect(() => render(<WeeklyActivityChart weeks={[]} />)).not.toThrow()
  })

  it('handles all-zero totals without division-by-zero artifacts', () => {
    const allZero: WeeklyTotal[] = weeks.map((w) => ({ ...w, total: 0 }))
    render(<WeeklyActivityChart weeks={allZero} />)
    expect(
      screen.getByRole('img', { name: /weekly activity/i }),
    ).toBeInTheDocument()
  })
})
