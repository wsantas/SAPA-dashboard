export const validAnalyticsFixture: unknown = {
  overview: {
    total_topics: 89,
    total_sessions: 2,
    current_streak: 1,
    longest_streak: 1,
    this_week: 89,
    due_reviews: 0,
  },
  confidence_distribution: {
    mastered: 18,
    strong: 71,
    learning: 0,
    weak: 0,
  },
  topics: [
    {
      name: 'hyperventilation',
      first_learned: '2026-04-13T17:43:20.095781',
      last_reviewed: '2026-04-13T17:52:35.980409',
      review_count: 1,
      confidence_score: 0.7,
      next_review: '2026-04-16T17:52:35.980444',
    },
    {
      name: 'foam rolling',
      first_learned: '2026-04-13T16:16:33.037600',
      last_reviewed: '2026-04-13T17:52:35.972008',
      review_count: 4,
      confidence_score: 0.8285714285714285,
      next_review: '2026-05-22T17:52:35.972042',
    },
  ],
  due_reviews: [],
  session_types: { session: 2 },
  weekly_chart: [],
  knowledge_gaps: [],
  review_timeline: [],
  new_vs_review: { new: 89, review: 0 },
  daily_activity: { '2026-04-13': 109 },
  weekly_totals: [
    { week: 'Jan 26', total: 0, current: false },
  ],
  topic_frequency: { 'foam rolling': 4 },
}

export const invalidAnalyticsFixture_missingOverview: unknown = {
  confidence_distribution: {
    mastered: 18,
    strong: 71,
    learning: 0,
    weak: 0,
  },
  topics: [],
  due_reviews: [],
}

export const invalidAnalyticsFixture_badConfidenceScore: unknown = {
  overview: {
    total_topics: 1,
    total_sessions: 1,
    current_streak: 0,
    longest_streak: 0,
    this_week: 0,
    due_reviews: 0,
  },
  confidence_distribution: { mastered: 0, strong: 0, learning: 0, weak: 0 },
  topics: [
    {
      name: 'impossible',
      first_learned: '2026-01-01T00:00:00',
      last_reviewed: '2026-01-01T00:00:00',
      review_count: 1,
      confidence_score: 1.5,
      next_review: '2026-01-02T00:00:00',
    },
  ],
  due_reviews: [],
}
