import { z } from 'zod'

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

export const TopicSchema = z.object({
  name: z.string(),
  first_learned: z.string(),
  last_reviewed: z.string(),
  review_count: z.number().int().nonnegative(),
  confidence_score: z.number().min(0).max(1),
  next_review: z.string(),
})

export const OverviewSchema = z.object({
  total_topics: z.number().int().nonnegative(),
  total_sessions: z.number().int().nonnegative(),
  current_streak: z.number().int().nonnegative(),
  longest_streak: z.number().int().nonnegative(),
  this_week: z.number().int().nonnegative(),
  due_reviews: z.number().int().nonnegative(),
})

export const ConfidenceDistributionSchema = z.object({
  mastered: z.number().int().nonnegative(),
  strong: z.number().int().nonnegative(),
  learning: z.number().int().nonnegative(),
  weak: z.number().int().nonnegative(),
})

export const AnalyticsSchema = z.object({
  overview: OverviewSchema,
  confidence_distribution: ConfidenceDistributionSchema,
  topics: z.array(TopicSchema),
  due_reviews: z.array(TopicSchema),
})

export type Topic = z.infer<typeof TopicSchema>
export type Overview = z.infer<typeof OverviewSchema>
export type ConfidenceDistribution = z.infer<typeof ConfidenceDistributionSchema>
export type Analytics = z.infer<typeof AnalyticsSchema>
