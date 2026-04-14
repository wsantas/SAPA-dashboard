import type { Overview } from '../types'

type StreakCardProps = {
  overview: Overview
}

export function StreakCard({ overview }: StreakCardProps) {
  return (
    <section aria-labelledby="streak-heading">
      <h2 id="streak-heading">Streak</h2>
      <dl>
        <div>
          <dt>Current</dt>
          <dd>{overview.current_streak} days</dd>
        </div>
        <div>
          <dt>Longest</dt>
          <dd>{overview.longest_streak} days</dd>
        </div>
        <div>
          <dt>Topics tracked</dt>
          <dd>{overview.total_topics}</dd>
        </div>
        <div>
          <dt>Sessions this week</dt>
          <dd>{overview.this_week}</dd>
        </div>
      </dl>
    </section>
  )
}
