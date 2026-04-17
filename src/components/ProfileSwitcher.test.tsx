import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileSwitcher } from './ProfileSwitcher'
import type { Profile } from '../types'

const profiles: Profile[] = [
  { id: 1, name: 'john', display_name: 'John' },
  { id: 2, name: 'jane', display_name: 'Jane' },
]

describe('<ProfileSwitcher />', () => {
  it('renders one option per profile', () => {
    render(<ProfileSwitcher profiles={profiles} activeId={1} onSwitch={() => {}} />)
    expect(
      screen.getByRole('option', { name: 'John' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Jane' }),
    ).toBeInTheDocument()
  })

  it('marks the active profile as selected', () => {
    render(<ProfileSwitcher profiles={profiles} activeId={2} onSwitch={() => {}} />)
    const select = screen.getByRole('combobox', { name: /switch profile/i })
    expect(select).toHaveValue('2')
  })

  it('calls onSwitch with the numeric id when the user picks a profile', async () => {
    const user = userEvent.setup()
    const onSwitch = vi.fn()
    render(
      <ProfileSwitcher profiles={profiles} activeId={1} onSwitch={onSwitch} />,
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: /switch profile/i }),
      '2',
    )
    expect(onSwitch).toHaveBeenCalledOnce()
    expect(onSwitch).toHaveBeenCalledWith(2)
  })
})
