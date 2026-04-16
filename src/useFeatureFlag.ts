import { useSyncExternalStore } from 'react'
import posthog from 'posthog-js'

/**
 * Typed wrapper over PostHog's feature flag API with a safe fallback
 * when PostHog isn't initialized (no VITE_POSTHOG_KEY) or the flag
 * hasn't been defined yet on the PostHog side.
 *
 * Uses useSyncExternalStore so the UI re-renders when the flag value
 * changes — PostHog's SDK fires 'onFeatureFlags' when the flag list
 * arrives or updates.
 */
export function useFeatureFlag(
  key: string,
  fallback: boolean = false,
): boolean {
  return useSyncExternalStore(
    (listener) => {
      if (!posthog.__loaded) return () => {}
      return posthog.onFeatureFlags(listener)
    },
    () => {
      if (!posthog.__loaded) return fallback
      const value = posthog.isFeatureEnabled(key)
      if (value === undefined) return fallback
      return value
    },
  )
}
