import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  getSessionStart,
  getSnapshot,
  subscribe,
} from '../analytics'
import type { TrackedEvent } from '../analytics'
import styles from './Card.module.css'
import usageStyles from './UsageAnalytics.module.css'

const EVENT_LABELS: Record<string, string> = {
  refresh_clicked: 'Refresh',
  profile_switched: 'Profile switch',
  heatmap_day_clicked: 'Heatmap drill-down',
  topic_expanded: 'Topic expanded',
  insights_generated: 'AI Insights generated',
  insights_regenerated: 'AI Insights regenerated',
}

const EVENT_ICONS: Record<string, string> = {
  refresh_clicked: '\u{1F504}',
  profile_switched: '\u{1F465}',
  heatmap_day_clicked: '\u{1F4C5}',
  topic_expanded: '\u{1F50D}',
  insights_generated: '\u{2728}',
  insights_regenerated: '\u{2728}',
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatEventTime(ts: number): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

function countByName(
  events: readonly TrackedEvent[],
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>()
  for (const e of events) {
    counts.set(e.name, (counts.get(e.name) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function UsageAnalytics() {
  const events = useSyncExternalStore(subscribe, getSnapshot)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - getSessionStart())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const breakdown = countByName(events)
  const maxCount = breakdown.length > 0 ? breakdown[0]!.count : 0

  return (
    <section
      className={`${styles.card} ${usageStyles.usageCard}`}
      aria-labelledby="usage-heading"
    >
      <div className={usageStyles.header}>
        <h2 id="usage-heading" className={styles.heading}>
          Dashboard Analytics
        </h2>
        <div className={usageStyles.sessionTimer}>
          <span className={usageStyles.timerDot} />
          {formatDuration(elapsed)}
        </div>
      </div>

      <div className={usageStyles.statsRow}>
        <div className={usageStyles.stat}>
          <span className={usageStyles.statValue}>{events.length}</span>
          <span className={usageStyles.statLabel}>interactions</span>
        </div>
        <div className={usageStyles.stat}>
          <span className={usageStyles.statValue}>
            {breakdown.length}
          </span>
          <span className={usageStyles.statLabel}>event types</span>
        </div>
        <div className={usageStyles.stat}>
          <span className={usageStyles.statValue}>
            {formatDuration(elapsed)}
          </span>
          <span className={usageStyles.statLabel}>session time</span>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className={usageStyles.breakdown}>
          <h3 className={usageStyles.subheading}>By interaction type</h3>
          <div className={usageStyles.bars}>
            {breakdown.map(({ name, count }) => (
              <div key={name} className={usageStyles.barRow}>
                <span className={usageStyles.barIcon}>
                  {EVENT_ICONS[name] ?? '\u{1F4CC}'}
                </span>
                <span className={usageStyles.barLabel}>
                  {EVENT_LABELS[name] ?? name}
                </span>
                <div className={usageStyles.barTrack}>
                  <div
                    className={usageStyles.barFill}
                    style={{
                      width: `${maxCount === 0 ? 0 : (count / maxCount) * 100}%`,
                    }}
                  />
                </div>
                <span className={usageStyles.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className={usageStyles.log}>
          <h3 className={usageStyles.subheading}>Event log</h3>
          <div className={usageStyles.logScroll}>
            {[...events]
              .reverse()
              .slice(0, 20)
              .map((e, i) => (
                <div key={`${e.timestamp}-${i}`} className={usageStyles.logEntry}>
                  <span className={usageStyles.logTime}>
                    {formatEventTime(e.timestamp)}
                  </span>
                  <span className={usageStyles.logIcon}>
                    {EVENT_ICONS[e.name] ?? '\u{1F4CC}'}
                  </span>
                  <span className={usageStyles.logName}>
                    {EVENT_LABELS[e.name] ?? e.name}
                  </span>
                  {Object.keys(e.properties).length > 0 && (
                    <span className={usageStyles.logProps}>
                      {Object.entries(e.properties)
                        .map(([k, v]) => `${k}=${String(v)}`)
                        .join(', ')}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <p className={usageStyles.empty}>
          Interact with the dashboard — every click, switch, and generation
          will appear here.
        </p>
      )}
    </section>
  )
}
