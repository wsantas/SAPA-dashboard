import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScenarioPicker } from './ScenarioPicker'
import { demoScenarios, SCENARIO_ORDER } from '../scenarios'

describe('<ScenarioPicker />', () => {
  it('renders one option per scenario in SCENARIO_ORDER', () => {
    render(<ScenarioPicker activeId="healthy" onSwitch={() => {}} />)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(SCENARIO_ORDER.length)
  })

  it('selects the active scenario', () => {
    render(<ScenarioPicker activeId="review_debt" onSwitch={() => {}} />)
    const select = screen.getByRole('combobox', {
      name: /switch demo scenario/i,
    })
    expect(select).toHaveValue('review_debt')
  })

  it('displays the active scenarios description beneath the select', () => {
    render(<ScenarioPicker activeId="burnout_incoming" onSwitch={() => {}} />)
    expect(
      screen.getByText(demoScenarios.burnout_incoming.description),
    ).toBeInTheDocument()
  })

  it('calls onSwitch with the scenario id when the user picks a new option', async () => {
    const user = userEvent.setup()
    const onSwitch = vi.fn()
    render(<ScenarioPicker activeId="healthy" onSwitch={onSwitch} />)
    await user.selectOptions(
      screen.getByRole('combobox', { name: /switch demo scenario/i }),
      'onboarding',
    )
    expect(onSwitch).toHaveBeenCalledWith('onboarding')
  })
})
