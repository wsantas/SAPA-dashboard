import { useSyncExternalStore } from 'react'
import {
  getActiveScenarioId,
  setActiveScenarioId,
  subscribe,
} from './scenarioStore'
import { demoScenarios } from './scenarios'
import type { DemoScenarioId } from './types'
import type { DemoScenario } from './scenarios'

/**
 * Returns the currently-selected demo scenario bundle and a setter.
 * Re-renders automatically when the active scenario changes, so
 * widgets keyed on the scenario refetch cleanly.
 */
export function useActiveScenario(): {
  scenario: DemoScenario
  scenarioId: DemoScenarioId
  setScenario: (id: DemoScenarioId) => void
} {
  const scenarioId = useSyncExternalStore(
    subscribe,
    getActiveScenarioId,
    getActiveScenarioId,
  )
  return {
    scenario: demoScenarios[scenarioId],
    scenarioId,
    setScenario: setActiveScenarioId,
  }
}
