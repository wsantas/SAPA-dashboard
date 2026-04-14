import type { Topic } from '../types'

type DueReviewsListProps = {
  reviews: readonly Topic[]
}

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

export function DueReviewsList({ reviews }: DueReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <section aria-labelledby="due-heading">
        <h2 id="due-heading">Due for review</h2>
        <p>All caught up — nothing due.</p>
      </section>
    )
  }

  return (
    <section aria-labelledby="due-heading">
      <h2 id="due-heading">Due for review ({reviews.length})</h2>
      <ul>
        {reviews.map((topic) => (
          <li key={topic.name}>
            <strong>{topic.name}</strong> — due{' '}
            {DATE_FORMAT.format(new Date(topic.next_review))}
          </li>
        ))}
      </ul>
    </section>
  )
}
