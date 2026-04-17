import { describe, expect, it } from 'vitest'
import { ALL_RULES, evaluateRules } from './automations'
import type { Analytics } from './types'
import { demoScenarios } from './scenarios'

/**
 * Helper: build a minimal Analytics object. Tests override only the
 * fields they care about; unmentioned fields get neutral defaults.
 */
function mkAnalytics(overrides: Partial<Analytics> = {}): Analytics {
  return {
    overview: {
      total_topics: 50,
      total_sessions: 10,
      current_streak: 0,
      longest_streak: 0,
      this_week: 0,
      due_reviews: 0,
      ...overrides.overview,
    },
    confidence_distribution: {
      mastered: 10,
      strong: 25,
      learning: 10,
      weak: 5,
      ...overrides.confidence_distribution,
    },
    topics: overrides.topics ?? [],
    due_reviews: overrides.due_reviews ?? [],
    weekly_totals: overrides.weekly_totals ?? [],
    daily_activity: overrides.daily_activity ?? {},
  }
}

describe('Rule: streak_broken', () => {
  const rule = ALL_RULES.find((r) => r.id === 'streak_broken')!

  it('fires when current streak is 0 and longest is >0', () => {
    const a = mkAnalytics({
      overview: {
        ...mkAnalytics().overview,
        current_streak: 0,
        longest_streak: 8,
      },
    })
    const outcome = rule.evaluate(a)
    expect(outcome.firing).toBe(true)
    if (outcome.firing) expect(outcome.reason).toContain('8-day')
  })

  it('does not fire when streak is active', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, current_streak: 5, longest_streak: 10 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })

  it('does not fire when user has never had a streak', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, current_streak: 0, longest_streak: 0 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })
})

describe('Rule: review_debt_overload', () => {
  const rule = ALL_RULES.find((r) => r.id === 'review_debt_overload')!

  it('fires at 6 overdue reviews (just above threshold)', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, due_reviews: 6 },
    })
    expect(rule.evaluate(a).firing).toBe(true)
  })

  it('does not fire at exactly 5 (threshold boundary)', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, due_reviews: 5 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })

  it('fires with critical severity', () => {
    expect(rule.severity).toBe('critical')
  })
})

describe('Rule: activity_trending_down', () => {
  const rule = ALL_RULES.find((r) => r.id === 'activity_trending_down')!

  it('fires when this week is less than 50% of prior 4-week avg', () => {
    const a = mkAnalytics({
      weekly_totals: [
        { week: 'W1', total: 1, current: false },
        { week: 'W2', total: 1, current: false },
        { week: 'W3', total: 1, current: false },
        { week: 'W4', total: 1, current: false },
        { week: 'W5', total: 1, current: false },
        { week: 'W6', total: 1, current: false },
        { week: 'W7', total: 1, current: false },
        { week: 'W8', total: 50, current: false },
        { week: 'W9', total: 40, current: false },
        { week: 'W10', total: 30, current: false },
        { week: 'W11', total: 20, current: false },
        { week: 'W12', total: 5, current: true },
      ],
    })
    expect(rule.evaluate(a).firing).toBe(true)
  })

  it('does not fire when the prior average is too low to be meaningful', () => {
    const a = mkAnalytics({
      weekly_totals: [
        { week: 'W1', total: 0, current: false },
        { week: 'W2', total: 1, current: false },
        { week: 'W3', total: 0, current: false },
        { week: 'W4', total: 1, current: false },
        { week: 'W5', total: 0, current: true },
      ],
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })

  it('does not fire with fewer than 5 weeks of data', () => {
    const a = mkAnalytics({
      weekly_totals: [
        { week: 'W1', total: 20, current: false },
        { week: 'W2', total: 5, current: true },
      ],
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })
})

describe('Rule: weak_concentration', () => {
  const rule = ALL_RULES.find((r) => r.id === 'weak_concentration')!

  it('fires when weak topics exceed 15% of total', () => {
    const a = mkAnalytics({
      confidence_distribution: { mastered: 0, strong: 0, learning: 30, weak: 20 },
    })
    expect(rule.evaluate(a).firing).toBe(true)
  })

  it('does not fire when total is below 10', () => {
    const a = mkAnalytics({
      confidence_distribution: { mastered: 0, strong: 0, learning: 0, weak: 5 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })

  it('does not fire when weak share is exactly 15% (boundary)', () => {
    const a = mkAnalytics({
      confidence_distribution: { mastered: 50, strong: 25, learning: 10, weak: 15 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })
})

describe('Rule: long_streak', () => {
  const rule = ALL_RULES.find((r) => r.id === 'long_streak')!

  it('fires at exactly 10 days', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, current_streak: 10 },
    })
    expect(rule.evaluate(a).firing).toBe(true)
  })

  it('does not fire at 9 days', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, current_streak: 9 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })
})

describe('Rule: ready_for_harder', () => {
  const rule = ALL_RULES.find((r) => r.id === 'ready_for_harder')!

  it('fires when 50+ topics, >20% mastered, ≤3 overdue', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, total_topics: 100, due_reviews: 2 },
      confidence_distribution: { mastered: 25, strong: 60, learning: 10, weak: 5 },
    })
    expect(rule.evaluate(a).firing).toBe(true)
  })

  it('does not fire with 4+ overdue reviews', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, due_reviews: 4 },
      confidence_distribution: { mastered: 30, strong: 50, learning: 15, weak: 5 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })

  it('does not fire when total topics < 50', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, total_topics: 40 },
      confidence_distribution: { mastered: 30, strong: 5, learning: 3, weak: 2 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })
})

describe('Rule: onboarding_guidance', () => {
  const rule = ALL_RULES.find((r) => r.id === 'onboarding_guidance')!

  it('fires when fewer than 10 topics tracked', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, total_topics: 4 },
    })
    expect(rule.evaluate(a).firing).toBe(true)
  })

  it('does not fire at 10 topics (boundary)', () => {
    const a = mkAnalytics({
      overview: { ...mkAnalytics().overview, total_topics: 10 },
    })
    expect(rule.evaluate(a).firing).toBe(false)
  })
})

describe('evaluateRules() sorting and categorization', () => {
  it('sorts firing rules critical → warning → info', () => {
    // review_debt scenario has: streak_broken (warning), review_debt_overload (critical),
    // weak_concentration (warning). evaluateRules should put critical first.
    const a = demoScenarios.review_debt.analytics
    const { firing } = evaluateRules(a)
    expect(firing.length).toBeGreaterThan(0)
    const severities = firing.map((e) => e.rule.severity)
    // The first firing rule must be the critical one
    expect(severities[0]).toBe('critical')
    // All criticals come before warnings, all warnings before info
    const criticalIdx = severities.findLastIndex((s) => s === 'critical')
    const warningFirstIdx = severities.findIndex((s) => s === 'warning')
    if (warningFirstIdx >= 0 && criticalIdx >= 0) {
      expect(criticalIdx).toBeLessThan(warningFirstIdx)
    }
  })

  it('returns all 7 rules across firing + dormant for any input', () => {
    const { firing, dormant } = evaluateRules(mkAnalytics())
    expect(firing.length + dormant.length).toBe(ALL_RULES.length)
    expect(ALL_RULES.length).toBe(7)
  })
})

describe('Scenario-driven firing patterns (integration)', () => {
  it('healthy scenario fires exactly 2 info rules', () => {
    const { firing } = evaluateRules(demoScenarios.healthy.analytics)
    expect(firing).toHaveLength(2)
    expect(firing.every((e) => e.rule.severity === 'info')).toBe(true)
    const ids = firing.map((e) => e.rule.id).sort()
    expect(ids).toEqual(['long_streak', 'ready_for_harder'])
  })

  it('power_user scenario fires exactly 2 info rules', () => {
    const { firing } = evaluateRules(demoScenarios.power_user.analytics)
    expect(firing.every((e) => e.rule.severity === 'info')).toBe(true)
    const ids = firing.map((e) => e.rule.id)
    expect(ids).toContain('long_streak')
    expect(ids).toContain('ready_for_harder')
  })

  it('review_debt scenario fires 1 critical + multiple warnings', () => {
    const { firing } = evaluateRules(demoScenarios.review_debt.analytics)
    const criticals = firing.filter((e) => e.rule.severity === 'critical')
    const warnings = firing.filter((e) => e.rule.severity === 'warning')
    expect(criticals).toHaveLength(1)
    expect(criticals[0]!.rule.id).toBe('review_debt_overload')
    expect(warnings.length).toBeGreaterThanOrEqual(2)
  })

  it('burnout_incoming scenario fires activity_trending_down', () => {
    const { firing } = evaluateRules(demoScenarios.burnout_incoming.analytics)
    const ids = firing.map((e) => e.rule.id)
    expect(ids).toContain('activity_trending_down')
    expect(ids).toContain('long_streak')
  })

  it('onboarding scenario fires onboarding_guidance only', () => {
    const { firing } = evaluateRules(demoScenarios.onboarding.analytics)
    expect(firing).toHaveLength(1)
    expect(firing[0]!.rule.id).toBe('onboarding_guidance')
  })
})
