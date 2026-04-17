import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from './ErrorBoundary'

// A helper component that throws synchronously when `shouldThrow` is true.
function Boom({
  shouldThrow,
  message = 'boom',
}: {
  shouldThrow: boolean
  message?: string
}) {
  if (shouldThrow) throw new Error(message)
  return <p>Child rendered normally</p>
}

describe('<ErrorBoundary />', () => {
  // React logs caught errors to console.error. Silence it so test output
  // stays clean — restored after each test.
  let spy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    spy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    spy.mockRestore()
  })

  it('renders its children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <Boom shouldThrow={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Child rendered normally')).toBeInTheDocument()
  })

  it('renders the fallback panel when a child throws', () => {
    render(
      <ErrorBoundary label="Test widget">
        <Boom shouldThrow={true} message="the widget exploded" />
      </ErrorBoundary>,
    )
    // role="alert" on the fallback
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(/test widget crashed/i)
    expect(alert).toHaveTextContent('the widget exploded')
  })

  it('defaults the label to "Widget" when none is provided', () => {
    render(
      <ErrorBoundary>
        <Boom shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/widget crashed/i)
  })

  it('shows a Retry button that clears the error and re-renders children', async () => {
    const user = userEvent.setup()
    // Use a component that can be toggled from throwing to not-throwing
    // via a re-render after the boundary resets.
    let throwNow = true
    function Toggleable() {
      if (throwNow) throw new Error('first render bad')
      return <p>Recovered</p>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Toggleable />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Simulate the underlying condition being fixed
    throwNow = false

    // Click Retry — the boundary clears its error state
    await user.click(screen.getByRole('button', { name: /retry/i }))

    // Re-render the tree so React rebuilds the child
    rerender(
      <ErrorBoundary>
        <Toggleable />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Recovered')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
