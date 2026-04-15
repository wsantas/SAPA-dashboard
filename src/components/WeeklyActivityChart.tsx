import type { WeeklyTotal } from '../types'
import styles from './Card.module.css'
import chartStyles from './WeeklyActivityChart.module.css'

type WeeklyActivityChartProps = {
  weeks: readonly WeeklyTotal[]
}

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 200
const CHART_TOP = 16
const CHART_BOTTOM = 168
const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP
const LABEL_Y = 188

export function WeeklyActivityChart({ weeks }: WeeklyActivityChartProps) {
  const maxTotal = Math.max(1, ...weeks.map((w) => w.total))
  const barCount = weeks.length
  const slotWidth = VIEWBOX_WIDTH / Math.max(1, barCount)
  const barWidth = Math.min(36, slotWidth * 0.6)
  const currentTotal = weeks.find((w) => w.current)?.total ?? 0
  const peakTotal = Math.max(...weeks.map((w) => w.total))

  return (
    <section
      className={`${styles.card} ${chartStyles.chartCard}`}
      aria-labelledby="chart-heading"
    >
      <div className={chartStyles.header}>
        <h2 id="chart-heading" className={styles.heading}>
          Weekly activity
        </h2>
        <div className={chartStyles.summary}>
          <span className={chartStyles.summaryLabel}>This week</span>
          <span className={chartStyles.summaryValue}>{currentTotal}</span>
          <span className={chartStyles.summaryDivider}>·</span>
          <span className={chartStyles.summaryLabel}>Peak</span>
          <span className={chartStyles.summaryValue}>{peakTotal}</span>
        </div>
      </div>
      <svg
        className={chartStyles.svg}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label={`Weekly activity over the last ${barCount} weeks, peak of ${peakTotal} sessions.`}
        preserveAspectRatio="none"
      >
        <line
          x1={0}
          y1={CHART_BOTTOM}
          x2={VIEWBOX_WIDTH}
          y2={CHART_BOTTOM}
          className={chartStyles.axis}
        />
        {weeks.map((week, i) => {
          const barHeight = (week.total / maxTotal) * CHART_HEIGHT
          const x = i * slotWidth + (slotWidth - barWidth) / 2
          const y = CHART_BOTTOM - barHeight
          const showLabel = i % 2 === 1 || i === barCount - 1
          return (
            <g key={week.week}>
              <title>{`${week.week}: ${week.total}`}</title>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={3}
                className={
                  week.current ? chartStyles.barCurrent : chartStyles.bar
                }
              />
              {showLabel && (
                <text
                  x={x + barWidth / 2}
                  y={LABEL_Y}
                  className={chartStyles.label}
                  textAnchor="middle"
                >
                  {week.week}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </section>
  )
}
