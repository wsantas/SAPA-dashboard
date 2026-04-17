/**
 * Client-side rule engine for the Automations widget.
 *
 * A Rule is a pure function of the current analytics state. The widget
 * re-evaluates every render (cheap — each rule is constant-time). Rules
 * don't do side effects — they only describe what's happening and what
 * a user might do about it.
 *
 * PostHog's Workflows team builds the server-side version of this at
 * scale; this is a miniature dogfood of the same concept.
 */

import type { Analytics } from './types'

export type RuleSeverity = 'info' | 'warning' | 'critical'

export type RuleOutcome =
  | { readonly firing: false }
  | {
      readonly firing: true
      readonly reason: string
      readonly suggestedAction?: string
    }

export type Rule = {
  readonly id: string
  readonly title: string
  readonly severity: RuleSeverity
  readonly evaluate: (analytics: Analytics) => RuleOutcome
}

export type EvaluatedRule = {
  readonly rule: Rule
  readonly outcome: RuleOutcome
}

// -------- Rule definitions --------
//
// Keep each rule short and self-contained. The evaluate() function
// returns { firing: false } or { firing: true, reason, suggestedAction }.

/** Fires when a previous streak has broken (current=0 but longest>0). */
const streakBrokenRule: Rule = {
  id: 'streak_broken',
  title: 'Streak broken',
  severity: 'warning',
  evaluate: (a) => {
    const { current_streak, longest_streak } = a.overview
    if (current_streak === 0 && longest_streak > 0) {
      return {
        firing: true,
        reason: `Your previous ${longest_streak}-day streak ended. The longer you wait, the harder it is to restart.`,
        suggestedAction: 'Do one 5-minute topic review today — any topic counts.',
      }
    }
    return { firing: false }
  },
}

/** Fires when more than 5 reviews are overdue. */
const reviewDebtOverloadRule: Rule = {
  id: 'review_debt_overload',
  title: 'Review debt overload',
  severity: 'critical',
  evaluate: (a) => {
    const { due_reviews } = a.overview
    if (due_reviews > 5) {
      return {
        firing: true,
        reason: `${due_reviews} topics are past their review dates. Every day they stay overdue, confidence decays further.`,
        suggestedAction: 'Pick the 3 lowest-confidence overdue topics and do a 15-minute review session today.',
      }
    }
    return { firing: false }
  },
}

/** Fires when weekly activity has dropped significantly from the prior average. */
const activityTrendingDownRule: Rule = {
  id: 'activity_trending_down',
  title: 'Activity trending down',
  severity: 'warning',
  evaluate: (a) => {
    const weeks = a.weekly_totals
    if (weeks.length < 5) return { firing: false }
    const current = weeks[weeks.length - 1]?.total ?? 0
    const priorFour = weeks.slice(-5, -1)
    const avgPrior = priorFour.reduce((s, w) => s + w.total, 0) / priorFour.length
    if (avgPrior === 0) return { firing: false }
    const ratio = current / avgPrior
    if (ratio < 0.5 && avgPrior >= 5) {
      const pctDrop = Math.round((1 - ratio) * 100)
      return {
        firing: true,
        reason: `This week's activity (${current}) is ${pctDrop}% below the prior 4-week average of ${Math.round(avgPrior)}.`,
        suggestedAction: 'Name the reason — training load? sleep? life stress? — and plan a smaller cadence rather than letting it drift to zero.',
      }
    }
    return { firing: false }
  },
}

/** Fires when the current streak is long enough to warrant celebration/protection. */
const longStreakRule: Rule = {
  id: 'long_streak',
  title: 'Long streak in progress',
  severity: 'info',
  evaluate: (a) => {
    const { current_streak } = a.overview
    if (current_streak >= 10) {
      return {
        firing: true,
        reason: `${current_streak}-day streak — you're in the zone where spaced repetition compounds.`,
        suggestedAction: 'Protect it with a minimum-viable daily session. Even 5 minutes keeps the chain.',
      }
    }
    return { firing: false }
  },
}

/** Fires when weak topics make up a concerning share of the total. */
const weakConcentrationRule: Rule = {
  id: 'weak_concentration',
  title: 'High share of weak topics',
  severity: 'warning',
  evaluate: (a) => {
    const c = a.confidence_distribution
    const total = c.mastered + c.strong + c.learning + c.weak
    if (total < 10) return { firing: false }
    const weakShare = c.weak / total
    if (weakShare > 0.15) {
      const pct = Math.round(weakShare * 100)
      return {
        firing: true,
        reason: `${c.weak} of ${total} topics (${pct}%) are at weak confidence — enough to drag the overall confidence distribution.`,
        suggestedAction: 'Prioritize review cycles over new material until the weak count drops below 10% of total.',
      }
    }
    return { firing: false }
  },
}

/** Fires for brand-new users to offer guidance. */
const onboardingRule: Rule = {
  id: 'onboarding_guidance',
  title: 'New learner — protect the habit',
  severity: 'info',
  evaluate: (a) => {
    const { total_topics, current_streak } = a.overview
    if (total_topics < 10) {
      return {
        firing: true,
        reason: `You have ${total_topics} topics${current_streak > 0 ? ` and a ${current_streak}-day streak` : ''}. The next 7 days matter most for habit formation.`,
        suggestedAction: 'Aim for one 5-10 minute session per day, even on busy days. Consistency beats intensity.',
      }
    }
    return { firing: false }
  },
}

/** Fires when user has strong fundamentals and room for more challenge. */
const readyForHarderRule: Rule = {
  id: 'ready_for_harder',
  title: 'Room to push into harder material',
  severity: 'info',
  evaluate: (a) => {
    const { total_topics, due_reviews } = a.overview
    const c = a.confidence_distribution
    const total = c.mastered + c.strong + c.learning + c.weak
    if (total < 50) return { firing: false }
    const masteredShare = c.mastered / total
    // Allow a few overdue reviews at scale — 3 out of 200+ is noise,
    // not a blocker on "you're ready for harder material".
    if (due_reviews <= 3 && masteredShare > 0.2) {
      return {
        firing: true,
        reason: `${total_topics} topics tracked, ${c.mastered} at mastered level, zero review debt — you have headroom for harder content.`,
        suggestedAction: 'Pick a specialization (one sub-domain) and go vertical rather than adding more breadth.',
      }
    }
    return { firing: false }
  },
}

export const ALL_RULES: readonly Rule[] = [
  streakBrokenRule,
  reviewDebtOverloadRule,
  activityTrendingDownRule,
  weakConcentrationRule,
  longStreakRule,
  readyForHarderRule,
  onboardingRule,
]

// -------- Evaluator --------

/**
 * Evaluate every rule against the current analytics and return both
 * firing and dormant rules. Firing rules are sorted by severity
 * (critical > warning > info) so the UI can render them in priority
 * order.
 */
export function evaluateRules(analytics: Analytics): {
  firing: readonly EvaluatedRule[]
  dormant: readonly EvaluatedRule[]
} {
  const severityRank: Record<RuleSeverity, number> = {
    critical: 0,
    warning: 1,
    info: 2,
  }

  const evaluated = ALL_RULES.map((rule) => ({
    rule,
    outcome: rule.evaluate(analytics),
  }))

  const firing = evaluated
    .filter((e): e is EvaluatedRule & { outcome: { firing: true } } =>
      e.outcome.firing,
    )
    .sort((a, b) => severityRank[a.rule.severity] - severityRank[b.rule.severity])

  const dormant = evaluated.filter((e) => !e.outcome.firing)

  return { firing, dormant }
}
