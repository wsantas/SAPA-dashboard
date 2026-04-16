import { useMemo, useState } from 'react'
import { fetchTopics } from '../api'
import { trackEvent } from '../analytics'
import { useAsyncData } from '../useAsyncData'
import type { Topic } from '../types'
import styles from './Card.module.css'
import topicStyles from './TopicsExplorer.module.css'

type SortKey = 'name' | 'confidence_score' | 'review_count' | 'next_review'
type SortDir = 'asc' | 'desc'

type Column = {
  readonly key: SortKey
  readonly label: string
  readonly align: 'left' | 'right'
  readonly format: (topic: Topic) => string
}

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

const DATETIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const COLUMNS: readonly Column[] = [
  {
    key: 'name',
    label: 'Topic',
    align: 'left',
    format: (t) => t.name,
  },
  {
    key: 'confidence_score',
    label: 'Confidence',
    align: 'right',
    format: (t) => `${Math.round(t.confidence_score * 100)}%`,
  },
  {
    key: 'review_count',
    label: 'Reviews',
    align: 'right',
    format: (t) => String(t.review_count),
  },
  {
    key: 'next_review',
    label: 'Next',
    align: 'right',
    format: (t) => DATE_FORMAT.format(new Date(t.next_review)),
  },
]

function compareTopics(a: Topic, b: Topic, key: SortKey): number {
  const aVal = a[key]
  const bVal = b[key]
  if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal
  return String(aVal).localeCompare(String(bVal))
}

function sortTopics(
  topics: readonly Topic[],
  key: SortKey,
  dir: SortDir,
): Topic[] {
  const copy = [...topics]
  copy.sort((a, b) => {
    const base = compareTopics(a, b, key)
    return dir === 'asc' ? base : -base
  })
  return copy
}

function confidenceLabel(score: number): string {
  if (score >= 0.8) return 'Mastered'
  if (score >= 0.6) return 'Strong'
  if (score >= 0.3) return 'Learning'
  return 'Weak'
}

function confidenceColor(score: number): string {
  if (score >= 0.8) return 'var(--success)'
  if (score >= 0.6) return 'var(--success-strong)'
  if (score >= 0.3) return 'var(--warning)'
  return 'var(--danger)'
}

function daysUntil(iso: string): string {
  const now = new Date()
  const target = new Date(iso)
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  return `in ${diff} days`
}

export function TopicsExplorer() {
  const { state } = useAsyncData(fetchTopics)
  const [sortKey, setSortKey] = useState<SortKey>('review_count')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  const sorted = useMemo(() => {
    const topics = state.status === 'success' ? state.data : []
    return sortTopics(topics, sortKey, sortDir)
  }, [state, sortKey, sortDir])

  function handleHeaderClick(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  function handleRowClick(topicName: string) {
    const next = expandedTopic === topicName ? null : topicName
    setExpandedTopic(next)
    if (next) trackEvent('topic_expanded', { topic: topicName })
  }

  return (
    <section
      className={`${styles.card} ${topicStyles.topicsCard}`}
      aria-labelledby="topics-heading"
    >
      <div className={topicStyles.header}>
        <h2 id="topics-heading" className={styles.heading}>
          Topics
          {state.status === 'success' ? ` · ${state.data.length}` : ''}
        </h2>
      </div>
      {state.status === 'loading' ? (
        <p className={topicStyles.placeholder}>Loading topics…</p>
      ) : state.status === 'error' ? (
        <p className={topicStyles.error} role="alert">
          {state.error.message}
        </p>
      ) : state.status === 'idle' ? null : (
        <div className={topicStyles.scroll}>
          <table className={topicStyles.table}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={
                      col.align === 'right'
                        ? topicStyles.headerRight
                        : topicStyles.headerLeft
                    }
                  >
                    <button
                      type="button"
                      className={topicStyles.headerButton}
                      onClick={() => handleHeaderClick(col.key)}
                      aria-sort={
                        sortKey === col.key
                          ? sortDir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span
                          className={topicStyles.sortIcon}
                          aria-hidden="true"
                        >
                          {sortDir === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((topic) => (
                <TopicRow
                  key={topic.name}
                  topic={topic}
                  expanded={expandedTopic === topic.name}
                  onClick={() => handleRowClick(topic.name)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function TopicRow({
  topic,
  expanded,
  onClick,
}: {
  topic: Topic
  expanded: boolean
  onClick: () => void
}) {
  return (
    <>
      <tr
        className={expanded ? topicStyles.rowExpanded : topicStyles.rowClickable}
        onClick={onClick}
      >
        {COLUMNS.map((col) => (
          <td
            key={col.key}
            className={
              col.align === 'right'
                ? topicStyles.cellRight
                : topicStyles.cellLeft
            }
          >
            {col.format(topic)}
          </td>
        ))}
      </tr>
      {expanded && (
        <tr className={topicStyles.detailRow}>
          <td colSpan={COLUMNS.length}>
            <div className={topicStyles.detail}>
              <div className={topicStyles.detailGrid}>
                <div className={topicStyles.detailStat}>
                  <span className={topicStyles.detailLabel}>Confidence</span>
                  <div className={topicStyles.confidenceBar}>
                    <div
                      className={topicStyles.confidenceFill}
                      style={{
                        width: `${Math.round(topic.confidence_score * 100)}%`,
                        background: confidenceColor(topic.confidence_score),
                      }}
                    />
                  </div>
                  <span className={topicStyles.detailValue}>
                    {Math.round(topic.confidence_score * 100)}% —{' '}
                    {confidenceLabel(topic.confidence_score)}
                  </span>
                </div>
                <div className={topicStyles.detailStat}>
                  <span className={topicStyles.detailLabel}>First learned</span>
                  <span className={topicStyles.detailValue}>
                    {DATETIME_FORMAT.format(new Date(topic.first_learned))}
                  </span>
                </div>
                <div className={topicStyles.detailStat}>
                  <span className={topicStyles.detailLabel}>Last reviewed</span>
                  <span className={topicStyles.detailValue}>
                    {DATETIME_FORMAT.format(new Date(topic.last_reviewed))}
                  </span>
                </div>
                <div className={topicStyles.detailStat}>
                  <span className={topicStyles.detailLabel}>Next review</span>
                  <span className={topicStyles.detailValue}>
                    {DATE_FORMAT.format(new Date(topic.next_review))} (
                    {daysUntil(topic.next_review)})
                  </span>
                </div>
                <div className={topicStyles.detailStat}>
                  <span className={topicStyles.detailLabel}>Review count</span>
                  <span className={topicStyles.detailValue}>
                    {topic.review_count}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
