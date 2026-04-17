import { useMemo, useState } from 'react'
import { trackEvent } from '../analytics'
import { evaluateRules } from '../automations'
import type { EvaluatedRule, RuleSeverity } from '../automations'
import type { Analytics } from '../types'
import styles from './Card.module.css'
import autoStyles from './AutomationsWidget.module.css'

type AutomationsWidgetProps = {
  readonly analytics: Analytics
}

const SEVERITY_LABEL: Record<RuleSeverity, string> = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'Info',
}

const SEVERITY_ICON: Record<RuleSeverity, string> = {
  critical: '●',
  warning: '●',
  info: '●',
}

export function AutomationsWidget({ analytics }: AutomationsWidgetProps) {
  const [showDormant, setShowDormant] = useState(false)

  const { firing, dormant } = useMemo(
    () => evaluateRules(analytics),
    [analytics],
  )

  const criticalCount = firing.filter(
    (e) => e.rule.severity === 'critical',
  ).length
  const warningCount = firing.filter(
    (e) => e.rule.severity === 'warning',
  ).length

  function handleToggleDormant() {
    const next = !showDormant
    setShowDormant(next)
    if (next) trackEvent('automations_expanded')
  }

  return (
    <section
      className={`${styles.card} ${autoStyles.automationsCard}`}
      aria-labelledby="automations-heading"
    >
      <div className={autoStyles.header}>
        <div>
          <h2 id="automations-heading" className={styles.heading}>
            Automations
          </h2>
          <p className={autoStyles.subtitle}>
            Client-side rule engine · re-evaluates on every state change
          </p>
        </div>
        <div className={autoStyles.summary}>
          {criticalCount > 0 && (
            <span
              className={`${autoStyles.summaryPill} ${autoStyles.pillCritical}`}
            >
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span
              className={`${autoStyles.summaryPill} ${autoStyles.pillWarning}`}
            >
              {warningCount} warning
            </span>
          )}
          <span className={autoStyles.summaryCount}>
            {firing.length} firing · {dormant.length} dormant
          </span>
        </div>
      </div>

      {firing.length === 0 ? (
        <div className={autoStyles.emptyState}>
          <span className={autoStyles.emptyIcon}>✓</span>
          <p>No rules firing. Everything looks healthy.</p>
        </div>
      ) : (
        <ul className={autoStyles.ruleList}>
          {firing.map(({ rule, outcome }) => (
            <li
              key={rule.id}
              className={`${autoStyles.ruleItem} ${autoStyles[`severity_${rule.severity}`]}`}
            >
              <div className={autoStyles.ruleHeader}>
                <span
                  className={`${autoStyles.severityDot} ${autoStyles[`dot_${rule.severity}`]}`}
                  aria-hidden="true"
                >
                  {SEVERITY_ICON[rule.severity]}
                </span>
                <span className={autoStyles.ruleTitle}>{rule.title}</span>
                <span className={autoStyles.ruleSeverity}>
                  {SEVERITY_LABEL[rule.severity]}
                </span>
              </div>
              {outcome.firing && (
                <>
                  <p className={autoStyles.ruleReason}>{outcome.reason}</p>
                  {outcome.suggestedAction && (
                    <p className={autoStyles.ruleAction}>
                      <span className={autoStyles.actionLabel}>
                        Suggested action:
                      </span>{' '}
                      {outcome.suggestedAction}
                    </p>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {dormant.length > 0 && (
        <div className={autoStyles.dormantSection}>
          <button
            type="button"
            className={autoStyles.dormantToggle}
            onClick={handleToggleDormant}
            aria-expanded={showDormant}
          >
            {showDormant ? '▾' : '▸'} {dormant.length} dormant rule
            {dormant.length === 1 ? '' : 's'}
          </button>
          {showDormant && (
            <ul className={autoStyles.dormantList}>
              {dormant.map(({ rule }: EvaluatedRule) => (
                <li key={rule.id} className={autoStyles.dormantItem}>
                  <span
                    className={`${autoStyles.severityDot} ${autoStyles[`dot_${rule.severity}`]} ${autoStyles.dotDormant}`}
                    aria-hidden="true"
                  >
                    {SEVERITY_ICON[rule.severity]}
                  </span>
                  <span className={autoStyles.dormantTitle}>{rule.title}</span>
                  <span className={autoStyles.dormantSeverity}>
                    {SEVERITY_LABEL[rule.severity]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
