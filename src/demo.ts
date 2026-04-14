import type { Analytics, InsightsResponse } from './types'

export const demoAnalytics: Analytics = {
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
      name: 'ice bath',
      first_learned: '2026-04-13T17:43:20.095781',
      last_reviewed: '2026-04-13T17:52:35.979193',
      review_count: 1,
      confidence_score: 0.7,
      next_review: '2026-04-16T17:52:35.979227',
    },
    {
      name: 'activation',
      first_learned: '2026-04-13T17:43:20.095781',
      last_reviewed: '2026-04-13T17:52:35.978051',
      review_count: 1,
      confidence_score: 0.7,
      next_review: '2026-04-16T17:52:35.978087',
    },
    {
      name: 'foam rolling',
      first_learned: '2026-04-13T16:16:33.037600',
      last_reviewed: '2026-04-13T17:52:35.972008',
      review_count: 4,
      confidence_score: 0.8285714285714285,
      next_review: '2026-05-22T17:52:35.972042',
    },
    {
      name: 'zone 2',
      first_learned: '2026-04-13T16:16:33.037600',
      last_reviewed: '2026-04-13T17:52:35.968285',
      review_count: 4,
      confidence_score: 0.8285714285714285,
      next_review: '2026-05-22T17:52:35.968322',
    },
    {
      name: 'squat',
      first_learned: '2026-04-13T16:16:33.037600',
      last_reviewed: '2026-04-13T17:52:35.967145',
      review_count: 4,
      confidence_score: 0.8285714285714285,
      next_review: '2026-05-22T17:52:35.967181',
    },
    {
      name: 'hiit',
      first_learned: '2026-04-13T16:16:33.037600',
      last_reviewed: '2026-04-13T17:52:35.964624',
      review_count: 4,
      confidence_score: 0.8285714285714285,
      next_review: '2026-05-22T17:52:35.964660',
    },
    {
      name: 'sleep',
      first_learned: '2026-04-13T16:16:33.037600',
      last_reviewed: '2026-04-13T17:52:35.959934',
      review_count: 4,
      confidence_score: 0.8285714285714285,
      next_review: '2026-05-22T17:52:35.959968',
    },
  ],
  due_reviews: [],
}

export const demoInsights: InsightsResponse = {
  insights: [
    {
      title: 'Strong foundation, zero weak spots',
      body: 'All 89 topics at strong+ confidence is impressive but suggests you might be ready for more challenging material in your focus areas.',
    },
    {
      title: 'Fresh start opportunity',
      body: 'With zero reviews due and a new streak starting, this is the perfect time to add advanced topics around your most-reviewed areas like sleep protocols or hypertrophy training.',
    },
    {
      title: 'Review frequency tells a story',
      body: 'Your top topics cluster around fitness and sleep optimization — consider branching into related areas like nutrition timing or recovery protocols to deepen expertise.',
    },
  ],
  model: 'claude-sonnet-4-20250514',
  generated_at: '2026-04-14T19:52:17.221791+00:00',
}
