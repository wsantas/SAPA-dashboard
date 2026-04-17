import { trackEvent } from '../analytics'
import { demoScenarios, SCENARIO_ORDER } from '../scenarios'
import type { DemoScenarioId } from '../types'
import styles from './ScenarioPicker.module.css'

type ScenarioPickerProps = {
  readonly activeId: DemoScenarioId
  readonly onSwitch: (id: DemoScenarioId) => void
}

export function ScenarioPicker({ activeId, onSwitch }: ScenarioPickerProps) {
  function handleChange(id: DemoScenarioId) {
    trackEvent('scenario_switched', { scenario: id })
    onSwitch(id)
  }

  const active = demoScenarios[activeId]

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={activeId}
        onChange={(e) => handleChange(e.target.value as DemoScenarioId)}
        aria-label="Switch demo scenario"
      >
        {SCENARIO_ORDER.map((id) => {
          const s = demoScenarios[id]
          return (
            <option key={id} value={id}>
              {s.icon}  {s.displayName}
            </option>
          )
        })}
      </select>
      <p className={styles.description}>{active.description}</p>
    </div>
  )
}
