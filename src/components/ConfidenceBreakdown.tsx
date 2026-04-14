import type { ConfidenceDistribution } from '../types'

type ConfidenceBreakdownProps = {
  distribution: ConfidenceDistribution
}

const LABELS: Record<keyof ConfidenceDistribution, string> = {
  mastered: 'Mastered',
  strong: 'Strong',
  learning: 'Learning',
  weak: 'Weak',
}

const ORDER: Array<keyof ConfidenceDistribution> = [
  'mastered',
  'strong',
  'learning',
  'weak',
]

export function ConfidenceBreakdown({ distribution }: ConfidenceBreakdownProps) {
  const total =
    distribution.mastered +
    distribution.strong +
    distribution.learning +
    distribution.weak

  return (
    <section aria-labelledby="confidence-heading">
      <h2 id="confidence-heading">Confidence ({total} topics)</h2>
      <ul>
        {ORDER.map((key) => {
          const count = distribution[key]
          const pct = total === 0 ? 0 : Math.round((count / total) * 100)
          return (
            <li key={key}>
              {LABELS[key]}: {count} ({pct}%)
            </li>
          )
        })}
      </ul>
    </section>
  )
}
