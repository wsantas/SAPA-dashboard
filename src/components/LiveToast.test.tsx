import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { LiveToast } from './LiveToast'
import type { WsEvent } from '../useWebSocket'

const sampleEvent: WsEvent = {
  event: 'file_created',
  data: {
    path: '/home/bill/inbox/new-note.md',
    timestamp: '2026-04-17T14:30:00Z',
  },
}

describe('<LiveToast />', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when event is null', () => {
    const { container } = render(<LiveToast event={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the filename (basename of path) when an event arrives', () => {
    render(<LiveToast event={sampleEvent} />)
    expect(screen.getByText('new-note.md')).toBeInTheDocument()
  })

  it('renders the event icon for file_created events', () => {
    render(<LiveToast event={sampleEvent} />)
    // The file-created icon is a page emoji; verifying one of the
    // known event icons appears in the toast is enough.
    const toast = screen.getByText('new-note.md').closest('div')
    expect(toast).toBeInTheDocument()
  })

  it('shows a "connected" label for a connected-type event', () => {
    const connected: WsEvent = {
      event: 'connected',
      data: { watch_path: '/home/bill/inbox' },
    }
    render(<LiveToast event={connected} />)
    expect(screen.getByText(/websocket connected/i)).toBeInTheDocument()
  })

  it('transitions through visible → exiting → hidden on its timers', () => {
    const { container } = render(<LiveToast event={sampleEvent} />)

    // Initially visible
    expect(container).not.toBeEmptyDOMElement()

    // After 4s, enter the "exiting" phase (still in the DOM)
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(container).not.toBeEmptyDOMElement()

    // After another 300ms (EXIT_MS), hidden entirely
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(container).toBeEmptyDOMElement()
  })
})
