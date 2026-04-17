/**
 * External store for the active demo scenario.
 *
 * State priority on load: URL query param > localStorage > default.
 * Changes write to both localStorage and the URL (via replaceState so
 * we don't clutter browser history) so refreshes and shared links both
 * preserve the chosen scenario.
 *
 * Read from React via useSyncExternalStore — same pattern as
 * analytics.ts. No React context needed; the store is a plain module.
 */

import {
  DEFAULT_SCENARIO_ID,
  demoScenarios,
} from './scenarios'
import type { DemoScenarioId } from './types'

type Listener = () => void

const STORAGE_KEY = 'sapa-dashboard:active-scenario'
const URL_PARAM = 'scenario'

const listeners = new Set<Listener>()

function isValidScenarioId(v: unknown): v is DemoScenarioId {
  return typeof v === 'string' && v in demoScenarios
}

function readInitialFromUrl(): DemoScenarioId | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const raw = params.get(URL_PARAM)
  return isValidScenarioId(raw) ? raw : null
}

function readInitialFromStorage(): DemoScenarioId | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return isValidScenarioId(raw) ? raw : null
  } catch {
    return null
  }
}

let _activeScenarioId: DemoScenarioId =
  readInitialFromUrl() ?? readInitialFromStorage() ?? DEFAULT_SCENARIO_ID

function syncUrl(id: DemoScenarioId): void {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    url.searchParams.set(URL_PARAM, id)
    window.history.replaceState({}, '', url.toString())
  } catch {
    // ignore — non-fatal
  }
}

function syncStorage(id: DemoScenarioId): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // ignore — e.g. storage quota exceeded or blocked
  }
}

// If we picked up a URL param at init, persist it to storage so a
// future reload without the param still lands on that scenario.
if (readInitialFromUrl()) syncStorage(_activeScenarioId)

export function getActiveScenarioId(): DemoScenarioId {
  return _activeScenarioId
}

export function setActiveScenarioId(id: DemoScenarioId): void {
  if (_activeScenarioId === id) return
  _activeScenarioId = id
  syncStorage(id)
  syncUrl(id)
  listeners.forEach((l) => l())
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
