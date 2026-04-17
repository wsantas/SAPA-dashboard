import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

// The module-under-test imports posthog-js; by default our mock leaves
// __loaded=false, which mirrors the "VITE_POSTHOG_KEY not set" state.
vi.mock('posthog-js', () => ({
  default: {
    __loaded: false,
    isFeatureEnabled: vi.fn(),
    onFeatureFlags: vi.fn(),
  },
}))

describe('useFeatureFlag', () => {
  it('returns the fallback value when PostHog is not initialized', async () => {
    const { useFeatureFlag } = await import('./useFeatureFlag')
    const { result } = renderHook(() => useFeatureFlag('any-flag', true))
    expect(result.current).toBe(true)
  })

  it('falls back to false by default when no fallback arg is provided', async () => {
    const { useFeatureFlag } = await import('./useFeatureFlag')
    const { result } = renderHook(() => useFeatureFlag('any-flag'))
    expect(result.current).toBe(false)
  })
})

describe('useFeatureFlag (with PostHog loaded)', () => {
  it('returns the PostHog-reported value when the flag is defined', async () => {
    vi.resetModules()
    vi.doMock('posthog-js', () => ({
      default: {
        __loaded: true,
        isFeatureEnabled: vi.fn().mockReturnValue(true),
        onFeatureFlags: vi.fn().mockReturnValue(() => {}),
      },
    }))

    const { useFeatureFlag } = await import('./useFeatureFlag')
    const { result } = renderHook(() => useFeatureFlag('show-thing', false))
    expect(result.current).toBe(true)

    vi.doUnmock('posthog-js')
  })

  it('returns the fallback when PostHog has no value for the flag', async () => {
    vi.resetModules()
    vi.doMock('posthog-js', () => ({
      default: {
        __loaded: true,
        isFeatureEnabled: vi.fn().mockReturnValue(undefined),
        onFeatureFlags: vi.fn().mockReturnValue(() => {}),
      },
    }))

    const { useFeatureFlag } = await import('./useFeatureFlag')
    const { result } = renderHook(() =>
      useFeatureFlag('undefined-flag', true),
    )
    expect(result.current).toBe(true)

    vi.doUnmock('posthog-js')
  })
})
