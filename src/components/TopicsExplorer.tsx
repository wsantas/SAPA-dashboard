import { useMemo, useState } from 'react'
import { fetchTopics } from '../api'
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

const NEXT_REVIEW_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
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
    format: (t) => NEXT_REVIEW_FORMAT.format(new Date(t.next_review)),
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

export function TopicsExplorer() {
  const { state } = useAsyncData(fetchTopics)
  const [sortKey, setSortKey] = useState<SortKey>('review_count')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

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
                        <span className={topicStyles.sortIcon} aria-hidden="true">
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
                <tr key={topic.name}>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
