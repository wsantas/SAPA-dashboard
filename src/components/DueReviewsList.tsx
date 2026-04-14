import type { Topic } from '../types'
import styles from './Card.module.css'

type DueReviewsListProps = {
  reviews: readonly Topic[]
}

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

export function DueReviewsList({ reviews }: DueReviewsListProps) {
  return (
    <section className={styles.card} aria-labelledby="due-heading">
      <h2 id="due-heading" className={styles.heading}>
        Due for review
        {reviews.length > 0 ? ` · ${reviews.length}` : ''}
      </h2>
      {reviews.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✓</span>
          <span>All caught up — nothing due.</span>
        </div>
      ) : (
        <ul className={styles.list}>
          {reviews.map((topic) => (
            <li key={topic.name} className={styles.listItem}>
              <span className={styles.listItemName}>{topic.name}</span>
              <span className={styles.listItemMeta}>
                {DATE_FORMAT.format(new Date(topic.next_review))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
