import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AutomationsWidget } from './AutomationsWidget'
import { demoScenarios } from '../scenarios'

describe('<AutomationsWidget />', () => {
  it('renders the review-debt scenarios critical + warning rules', () => {
    render(
      <AutomationsWidget analytics={demoScenarios.review_debt.analytics} />,
    )
    // Critical pill in the summary
    expect(screen.getByText(/1 critical/i)).toBeInTheDocument()
    // The critical rule title is visible
    expect(screen.getByText(/review debt overload/i)).toBeInTheDocument()
    // At least one warning-level rule title
    expect(screen.getByText(/streak broken/i)).toBeInTheDocument()
  })

  it('renders the healthy scenarios two info rules', () => {
    render(<AutomationsWidget analytics={demoScenarios.healthy.analytics} />)
    expect(screen.getByText(/long streak in progress/i)).toBeInTheDocument()
    expect(screen.getByText(/room to push/i)).toBeInTheDocument()
    // No critical pill when everything is info
    expect(screen.queryByText(/critical/i)).not.toBeInTheDocument()
  })

  it('shows the suggested action for each firing rule', () => {
    render(
      <AutomationsWidget analytics={demoScenarios.review_debt.analytics} />,
    )
    // "Suggested action:" label appears for every firing rule
    const labels = screen.getAllByText(/suggested action/i)
    expect(labels.length).toBeGreaterThanOrEqual(3)
  })

  it('collapses dormant rules by default, expands on click', async () => {
    const user = userEvent.setup()
    render(<AutomationsWidget analytics={demoScenarios.healthy.analytics} />)

    // Dormant section is present but content hidden
    const toggle = screen.getByRole('button', {
      name: /dormant rule/i,
    })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    // One dormant rule title should now be visible
    expect(screen.getByText(/review debt overload/i)).toBeInTheDocument()
  })

  it('shows the empty-state message when no rules fire', () => {
    // Construct a bland analytics that fires nothing: 30 total with
    // balanced confidence, active streak but below 10, no overdue, no
    // meaningful week decline.
    render(
      <AutomationsWidget
        analytics={{
          overview: {
            total_topics: 30,
            total_sessions: 5,
            current_streak: 3,
            longest_streak: 3,
            this_week: 10,
            due_reviews: 0,
          },
          confidence_distribution: {
            mastered: 5,
            strong: 15,
            learning: 8,
            weak: 2,
          },
          topics: [],
          due_reviews: [],
          weekly_totals: [],
          daily_activity: {},
        }}
      />,
    )
    expect(screen.getByText(/no rules firing/i)).toBeInTheDocument()
  })
})
