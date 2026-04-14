import type { Overview } from '../types'
import styles from './Card.module.css'

type StreakCardProps = {
  overview: Overview
}

export function StreakCard({ overview }: StreakCardProps) {
  return (
    <section className={styles.card} aria-labelledby="streak-heading">
      <h2 id="streak-heading" className={styles.heading}>
        Streak
      </h2>
      <div className={styles.statGrid}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Current</span>
          <span className={styles.statValue}>
            {overview.current_streak}
            <span className={styles.statUnit}>days</span>
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Longest</span>
          <span className={styles.statValue}>
            {overview.longest_streak}
            <span className={styles.statUnit}>days</span>
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Topics tracked</span>
          <span className={styles.statValue}>{overview.total_topics}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Sessions this week</span>
          <span className={styles.statValue}>{overview.this_week}</span>
        </div>
      </div>
    </section>
  )
}
