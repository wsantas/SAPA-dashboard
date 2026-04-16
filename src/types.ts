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

export const WeeklyTotalSchema = z.object({
  week: z.string(),
  total: z.number().int().nonnegative(),
  current: z.boolean(),
})

export const DailyActivitySchema = z.record(
  z.string(),
  z.number().int().nonnegative(),
)

export const AnalyticsSchema = z.object({
  overview: OverviewSchema,
  confidence_distribution: ConfidenceDistributionSchema,
  topics: z.array(TopicSchema),
  due_reviews: z.array(TopicSchema),
  weekly_totals: z.array(WeeklyTotalSchema),
  daily_activity: DailyActivitySchema,
})

export type Topic = z.infer<typeof TopicSchema>
export type Overview = z.infer<typeof OverviewSchema>
export type ConfidenceDistribution = z.infer<typeof ConfidenceDistributionSchema>
export type WeeklyTotal = z.infer<typeof WeeklyTotalSchema>
export type DailyActivity = z.infer<typeof DailyActivitySchema>
export type Analytics = z.infer<typeof AnalyticsSchema>

export const InsightSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
})

export const InsightsResponseSchema = z.object({
  insights: z.array(InsightSchema).min(1).max(5),
  model: z.string(),
  generated_at: z.string(),
})

export type Insight = z.infer<typeof InsightSchema>
export type InsightsResponse = z.infer<typeof InsightsResponseSchema>

export const HistoryEntrySchema = z.object({
  id: z.number().int(),
  session_type: z.string(),
  topic: z.string(),
  prompt: z.string(),
  response: z.string(),
  notes: z.string().nullable(),
  created_at: z.string(),
})

export type HistoryEntry = z.infer<typeof HistoryEntrySchema>

export const ProfileSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  display_name: z.string(),
})

export type Profile = z.infer<typeof ProfileSchema>
