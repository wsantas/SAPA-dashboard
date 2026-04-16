import styles from './Card.module.css'
import heatStyles from './ActivityHeatmap.module.css'

type ActivityHeatmapProps = {
  dailyActivity: Readonly<Record<string, number>>
}

/** Layout constants */
const COLS = 13
const ROWS = 7
const CELL_SIZE = 14
const CELL_GAP = 3
const LEFT_PADDING = 30
const TOP_PADDING = 18
const VIEWBOX_WIDTH = LEFT_PADDING + COLS * (CELL_SIZE + CELL_GAP)
const VIEWBOX_HEIGHT = TOP_PADDING + ROWS * (CELL_SIZE + CELL_GAP)

const DAY_LABELS: readonly (readonly [number, string])[] = [
  [0, 'Mon'],
  [2, 'Wed'],
  [4, 'Fri'],
] as const

function getColor(count: number): string {
  if (count === 0) return 'rgba(255,255,255,0.03)'
  if (count <= 3) return 'rgba(16,185,129,0.3)'
  if (count <= 10) return 'rgba(16,185,129,0.55)'
  if (count <= 30) return 'var(--success)'
  return 'var(--success-strong)'
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function formatTooltip(d: Date, count: number): string {
  const month = MONTH_SHORT[d.getMonth()]
  return `${month ?? ''} ${d.getDate()}: ${count} session${count === 1 ? '' : 's'}`
}

/**
 * Build the 13-week × 7-day grid working backward from today.
 * Returns cells in column-major order (each column = 1 week).
 */
function buildGrid(
  dailyActivity: Readonly<Record<string, number>>,
  today: Date,
) {
  const totalDays = COLS * ROWS // 91 days

  // End date is today; find the Monday of the week that is 12 weeks before this week.
  // Today's day-of-week as Mon=0..Sun=6
  const todayDow = (today.getDay() + 6) % 7
  const endOffset = 6 - todayDow // days from today to reach Sunday of this week
  // The grid ends at Sunday of the current week
  const gridEnd = new Date(today)
  gridEnd.setDate(gridEnd.getDate() + endOffset)

  const gridStart = new Date(gridEnd)
  gridStart.setDate(gridStart.getDate() - totalDays + 1)

  type CellData = {
    date: Date
    iso: string
    count: number
    col: number
    row: number
  }

  const cells: CellData[] = []
  const monthLabels: { col: number; label: string }[] = []
  let prevMonth = -1

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(gridStart)
    d.setDate(d.getDate() + i)
    const col = Math.floor(i / 7)
    const row = i % 7
    const iso = formatDate(d)
    const count = dailyActivity[iso] ?? 0
    cells.push({ date: d, iso, count, col, row })

    // Month label: first cell of a column whose month differs from previous column
    if (row === 0 && d.getMonth() !== prevMonth) {
      monthLabels.push({ col, label: MONTH_SHORT[d.getMonth()] ?? '' })
      prevMonth = d.getMonth()
    }
  }

  return { cells, monthLabels }
}

export function ActivityHeatmap({ dailyActivity }: ActivityHeatmapProps) {
  const today = new Date()
  const { cells, monthLabels } = buildGrid(dailyActivity, today)
  const totalSessions = cells.reduce((sum, c) => sum + c.count, 0)

  const headingId = 'heatmap-heading'

  return (
    <section
      className={`${styles.card} ${heatStyles.heatmapCard}`}
      aria-labelledby={headingId}
    >
      <div className={heatStyles.header}>
        <h2 id={headingId} className={styles.heading}>
          Activity
        </h2>
        <div className={heatStyles.summary}>
          <span className={heatStyles.summaryLabel}>90 days</span>
          <span className={heatStyles.summaryValue}>{totalSessions}</span>
          <span className={heatStyles.summaryLabel}>sessions</span>
        </div>
      </div>
      <svg
        className={heatStyles.svg}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label={`Activity heatmap showing ${totalSessions} sessions over the last 90 days.`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Day-of-week labels */}
        {DAY_LABELS.map(([row, label]) => (
          <text
            key={label}
            x={LEFT_PADDING - 6}
            y={TOP_PADDING + row * (CELL_SIZE + CELL_GAP) + CELL_SIZE * 0.8}
            className={heatStyles.dayLabel}
            textAnchor="end"
          >
            {label}
          </text>
        ))}

        {/* Month labels */}
        {monthLabels.map(({ col, label }) => (
          <text
            key={`${col}-${label}`}
            x={LEFT_PADDING + col * (CELL_SIZE + CELL_GAP)}
            y={TOP_PADDING - 6}
            className={heatStyles.monthLabel}
          >
            {label}
          </text>
        ))}

        {/* Cells */}
        {cells.map((cell) => (
          <rect
            key={cell.iso}
            x={LEFT_PADDING + cell.col * (CELL_SIZE + CELL_GAP)}
            y={TOP_PADDING + cell.row * (CELL_SIZE + CELL_GAP)}
            width={CELL_SIZE}
            height={CELL_SIZE}
            rx={2}
            ry={2}
            fill={getColor(cell.count)}
            className={heatStyles.cell}
          >
            <title>{formatTooltip(cell.date, cell.count)}</title>
          </rect>
        ))}
      </svg>
    </section>
  )
}
