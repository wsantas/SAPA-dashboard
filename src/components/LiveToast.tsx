import { useEffect, useReducer, useRef } from 'react'
import type { WsEvent } from '../useWebSocket'
import styles from './LiveToast.module.css'

type Props = {
  readonly event: WsEvent | null
}

const DISPLAY_MS = 4000
const EXIT_MS = 300

const EVENT_ICONS: Record<string, string> = {
  connected: '\u{1F50C}',
  file_created: '\u{1F4C4}',
  file_modified: '\u270F\uFE0F',
  file_deleted: '\u{1F5D1}\uFE0F',
  topics_extracted: '\u{1F9E0}',
  session_recorded: '\u{2705}',
}

function extractLabel(event: WsEvent): string {
  const data = event.data
  if (typeof data['path'] === 'string') {
    const segments = data['path'].split('/')
    return segments[segments.length - 1] ?? event.event
  }
  if (typeof data['file'] === 'string') {
    const segments = data['file'].split('/')
    return segments[segments.length - 1] ?? event.event
  }
  if (typeof data['watch_path'] === 'string') return 'WebSocket connected'
  return event.event.replace(/_/g, ' ')
}

function extractTime(event: WsEvent): string {
  const ts = event.data['timestamp']
  if (typeof ts === 'string') {
    const date = new Date(ts)
    if (!isNaN(date.getTime())) {
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  }
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

type ToastState = {
  readonly phase: 'hidden' | 'visible' | 'exiting'
  readonly displayed: WsEvent | null
  readonly trigger: WsEvent | null
}

type ToastAction =
  | { type: 'new-event'; event: WsEvent }
  | { type: 'exit' }
  | { type: 'hide' }

function toastReducer(prev: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'new-event':
      return { phase: 'visible', displayed: action.event, trigger: action.event }
    case 'exit':
      return { ...prev, phase: 'exiting' }
    case 'hide':
      return { phase: 'hidden', displayed: null, trigger: prev.trigger }
  }
}

const INITIAL_STATE: ToastState = { phase: 'hidden', displayed: null, trigger: null }

export function LiveToast({ event }: Props) {
  const [state, dispatch] = useReducer(toastReducer, INITIAL_STATE)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // When the parent passes a new event, show a toast
  useEffect(() => {
    if (!event) return
    dispatch({ type: 'new-event', event })
  }, [event])

  // Schedule the exit transition DISPLAY_MS after becoming visible.
  // Scoped to visible→exiting only so the cleanup doesn't interfere
  // with the subsequent hide timer.
  useEffect(() => {
    if (state.phase !== 'visible') return
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'exit' })
    }, DISPLAY_MS)
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [state.phase, state.trigger])

  // Schedule the full hide EXIT_MS after the exit animation begins.
  // Separate effect so the visible-phase cleanup doesn't clear it.
  useEffect(() => {
    if (state.phase !== 'exiting') return
    exitTimerRef.current = setTimeout(() => {
      dispatch({ type: 'hide' })
    }, EXIT_MS)
    return () => {
      clearTimeout(exitTimerRef.current)
    }
  }, [state.phase])

  if (state.phase === 'hidden' || !state.displayed) return null

  const icon = EVENT_ICONS[state.displayed.event] ?? '\u{1F4E1}'
  const name = extractLabel(state.displayed)
  const time = extractTime(state.displayed)

  return (
    <div
      className={styles.toast}
      data-exiting={state.phase === 'exiting' ? 'true' : undefined}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.filename}>{name}</span>
      {time && <span className={styles.time}>{time}</span>}
    </div>
  )
}
