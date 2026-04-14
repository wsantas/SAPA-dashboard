import type { ConfidenceDistribution } from '../types'
import styles from './Card.module.css'

type ConfidenceBreakdownProps = {
  distribution: ConfidenceDistribution
}

const LABELS: Record<keyof ConfidenceDistribution, string> = {
  mastered: 'Mastered',
  strong: 'Strong',
  learning: 'Learning',
  weak: 'Weak',
}

const FILL_COLOR: Record<keyof ConfidenceDistribution, string> = {
  mastered: 'var(--success)',
  strong: 'var(--success-strong)',
  learning: 'var(--warning)',
  weak: 'var(--danger)',
}

const ORDER: Array<keyof ConfidenceDistribution> = [
  'mastered',
  'strong',
  'learning',
  'weak',
]

export function ConfidenceBreakdown({
  distribution,
}: ConfidenceBreakdownProps) {
  const total =
    distribution.mastered +
    distribution.strong +
    distribution.learning +
    distribution.weak

  return (
    <section className={styles.card} aria-labelledby="confidence-heading">
      <h2 id="confidence-heading" className={styles.heading}>
        Confidence
      </h2>
      <div className={styles.bars}>
        {ORDER.map((key) => {
          const count = distribution[key]
          const pct = total === 0 ? 0 : (count / total) * 100
          return (
            <div key={key} className={styles.bar}>
              <div className={styles.barHeader}>
                <span className={styles.barLabel}>{LABELS[key]}</span>
                <span className={styles.barValue}>
                  {count} · {Math.round(pct)}%
                </span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct}%`, background: FILL_COLOR[key] }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className={styles.caption}>{total} topics</p>
    </section>
  )
}
