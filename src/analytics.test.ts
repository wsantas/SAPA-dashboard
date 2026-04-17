/**
 * Tests for the in-memory event tracker. The module holds state in
 * closure variables, so between tests we need a fresh module import
 * via vi.resetModules() to reset that state. Alternative would be
 * exposing a __reset() helper in the module, but keeping the module
 * surface production-clean is better than adding test-only hooks.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

// Stub posthog-js before any import of analytics.ts evaluates, so the
// module's posthog.__loaded check returns false and capture() is never
// called in tests.
vi.mock('posthog-js', () => ({
  default: {
    __loaded: false,
    capture: vi.fn(),
  },
}))

async function importFresh() {
  vi.resetModules()
  return await import('./analytics')
}

describe('trackEvent / getSnapshot', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('starts with an empty event log', async () => {
    const { getSnapshot } = await importFresh()
    expect(getSnapshot()).toEqual([])
  })

  it('appends a new event with the given name and properties', async () => {
    const { trackEvent, getSnapshot } = await importFresh()
    trackEvent('clicked', { where: 'heatmap', day: '2026-04-15' })
    const events = getSnapshot()
    expect(events).toHaveLength(1)
    expect(events[0]!.name).toBe('clicked')
    expect(events[0]!.properties).toEqual({
      where: 'heatmap',
      day: '2026-04-15',
    })
  })

  it('stamps a numeric timestamp close to Date.now()', async () => {
    const { trackEvent, getSnapshot } = await importFresh()
    const before = Date.now()
    trackEvent('ping')
    const after = Date.now()
    const ts = getSnapshot()[0]!.timestamp
    expect(ts).toBeGreaterThanOrEqual(before)
    expect(ts).toBeLessThanOrEqual(after)
  })

  it('defaults properties to an empty object when omitted', async () => {
    const { trackEvent, getSnapshot } = await importFresh()
    trackEvent('ping')
    expect(getSnapshot()[0]!.properties).toEqual({})
  })

  it('preserves insertion order', async () => {
    const { trackEvent, getSnapshot } = await importFresh()
    trackEvent('a')
    trackEvent('b')
    trackEvent('c')
    expect(getSnapshot().map((e) => e.name)).toEqual(['a', 'b', 'c'])
  })
})

describe('MAX_EVENTS cap — prevents unbounded growth', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('caps the event log at 500 entries, dropping the oldest', async () => {
    const { trackEvent, getSnapshot } = await importFresh()
    for (let i = 0; i < 505; i++) {
      trackEvent(`evt_${i}`)
    }
    const events = getSnapshot()
    expect(events).toHaveLength(500)
    // The oldest 5 events should have been dropped: evt_0..evt_4
    expect(events[0]!.name).toBe('evt_5')
    expect(events[events.length - 1]!.name).toBe('evt_504')
  })
})

describe('subscribe / unsubscribe', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('notifies subscribers on every trackEvent call', async () => {
    const { trackEvent, subscribe } = await importFresh()
    const listener = vi.fn()
    subscribe(listener)
    trackEvent('a')
    trackEvent('b')
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('returns an unsubscribe function that stops notifications', async () => {
    const { trackEvent, subscribe } = await importFresh()
    const listener = vi.fn()
    const unsubscribe = subscribe(listener)
    trackEvent('first')
    unsubscribe()
    trackEvent('second')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('supports multiple concurrent subscribers', async () => {
    const { trackEvent, subscribe } = await importFresh()
    const a = vi.fn()
    const b = vi.fn()
    subscribe(a)
    subscribe(b)
    trackEvent('ping')
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
  })
})

describe('getSnapshot — useSyncExternalStore contract', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns a new reference when events change (so React detects the change)', async () => {
    const { trackEvent, getSnapshot } = await importFresh()
    const before = getSnapshot()
    trackEvent('a')
    const after = getSnapshot()
    expect(after).not.toBe(before)
  })

  it('returns a stable reference if no events were added', async () => {
    const { getSnapshot } = await importFresh()
    const first = getSnapshot()
    const second = getSnapshot()
    expect(second).toBe(first)
  })
})
