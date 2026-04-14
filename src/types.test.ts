import { describe, expect, it } from 'vitest'
import { AnalyticsSchema } from './types'
import {
  validAnalyticsFixture,
  invalidAnalyticsFixture_missingOverview,
  invalidAnalyticsFixture_badConfidenceScore,
} from './__fixtures__/analytics'

describe('AnalyticsSchema', () => {
  it('parses a full valid response', () => {
    const result = AnalyticsSchema.safeParse(validAnalyticsFixture)
    expect(result.success).toBe(true)
  })

  it('exposes the nested overview fields after parsing', () => {
    const parsed = AnalyticsSchema.parse(validAnalyticsFixture)
    expect(parsed.overview.total_topics).toBe(89)
    expect(parsed.overview.current_streak).toBe(1)
    expect(parsed.confidence_distribution.mastered).toBe(18)
    expect(parsed.topics).toHaveLength(2)
  })

  it('strips unknown top-level keys silently (lenient by default)', () => {
    const parsed = AnalyticsSchema.parse(validAnalyticsFixture)
    expect(parsed).not.toHaveProperty('session_types')
    expect(parsed).not.toHaveProperty('weekly_chart')
    expect(parsed).not.toHaveProperty('daily_activity')
  })

  it('rejects a payload missing overview', () => {
    const result = AnalyticsSchema.safeParse(invalidAnalyticsFixture_missingOverview)
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join('.'))
      expect(paths).toContain('overview')
    }
  })

  it('rejects a topic whose confidence_score is out of the [0, 1] range', () => {
    const result = AnalyticsSchema.safeParse(invalidAnalyticsFixture_badConfidenceScore)
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join('.'))
      expect(paths).toContain('topics.0.confidence_score')
    }
  })
})
