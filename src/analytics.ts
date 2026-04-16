/**
 * Lightweight client-side event tracker for dashboard meta-analytics.
 * Keeps an in-memory log for the UsageAnalytics widget AND multiplexes
 * to PostHog when posthog-js is initialized (guarded by __loaded so we
 * silently no-op if VITE_POSTHOG_KEY is unset).
 *
 * Integrates with React via useSyncExternalStore: the widget subscribes
 * to the event list and re-renders on every new tracked event.
 */

import posthog from 'posthog-js'

export type TrackedEvent = {
  readonly name: string
  readonly timestamp: number
  readonly properties: Readonly<Record<string, unknown>>
}

type Listener = () => void

const MAX_EVENTS = 500

let events: readonly TrackedEvent[] = []
const listeners = new Set<Listener>()
const sessionStart = Date.now()

function emitChange() {
  listeners.forEach((l) => l())
}

function sendToPostHog(name: string, properties: Record<string, unknown>) {
  // __loaded is set after posthog.init() completes. If PostHog wasn't
  // initialized (no VITE_POSTHOG_KEY) this is false and we no-op.
  if (!posthog.__loaded) return
  try {
    posthog.capture(name, properties)
  } catch (err) {
    // PostHog network failures must never affect the local store or UI.
    console.warn('[analytics] posthog.capture failed', err)
  }
}

export function trackEvent(
  name: string,
  properties: Record<string, unknown> = {},
): void {
  const next: TrackedEvent = { name, timestamp: Date.now(), properties }
  // Cap at MAX_EVENTS: drop the oldest when full. Keeps memory bounded
  // during long-running sessions with heavy interaction.
  events =
    events.length >= MAX_EVENTS
      ? [...events.slice(events.length - MAX_EVENTS + 1), next]
      : [...events, next]
  emitChange()
  sendToPostHog(name, properties)
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): readonly TrackedEvent[] {
  return events
}

export function getSessionStart(): number {
  return sessionStart
}
