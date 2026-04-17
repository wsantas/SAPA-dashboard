/**
 * Hand-curated demo scenarios. Each scenario is a complete bundle
 * (analytics + topics + history + insights + profile identity) that
 * tells a specific story: healthy user, review-debt crisis, brand-new
 * user, power user, or burnout-incoming.
 *
 * The Workflows / Automations widget will key its rule-firing off
 * these scenario dimensions, so recruiters can watch rules fire by
 * switching scenarios.
 */

import type {
  Analytics,
  DemoScenarioId,
  DashboardSignals,
  HistoryEntry,
  InsightsResponse,
  Profile,
  Topic,
} from './types'
import {
  demoAnalytics,
  demoAnalyticsJane,
  demoTopicsJane,
  demoTopicsJohn,
} from './demo'

export type DemoScenario = {
  readonly id: DemoScenarioId
  readonly displayName: string
  readonly description: string
  readonly icon: string
  readonly profile: Profile
  readonly analytics: Analytics
  readonly topics: readonly Topic[]
  readonly history: readonly HistoryEntry[]
  readonly insights: InsightsResponse
  readonly signals: DashboardSignals
}

// -------- Helpers --------

const PROFILE_JOHN: Profile = { id: 1, name: 'john', display_name: 'John' }
const PROFILE_JANE: Profile = { id: 2, name: 'jane', display_name: 'Jane' }
const PROFILE_TAYLOR: Profile = { id: 3, name: 'taylor', display_name: 'Taylor' }

let _scenarioHistoryId = 1
function mkHist(
  date: string,
  time: string,
  sessionType: string,
  topic: string,
): HistoryEntry {
  return {
    id: _scenarioHistoryId++,
    session_type: sessionType,
    topic,
    prompt: `${topic} — session content.`,
    response: `${topic} — expanded content.`,
    notes: null,
    created_at: `${date}T${time}.000000`,
  }
}

function mkTopic(
  name: string,
  confidence_score: number,
  review_count: number,
  daysAgoLearned: number,
  daysUntilReview: number,
): Topic {
  const now = Date.now()
  const day = 86_400_000
  const toIso = (ms: number) => new Date(ms).toISOString().replace('Z', '')
  return {
    name,
    first_learned: toIso(now - daysAgoLearned * day),
    last_reviewed: toIso(now - Math.max(0, daysAgoLearned - review_count * 2) * day),
    review_count,
    confidence_score,
    next_review: toIso(now + daysUntilReview * day),
  }
}

function dateNDaysAgo(n: number): string {
  const d = new Date(Date.now() - n * 86_400_000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// -------- Scenario 1: Healthy Consistency --------
_scenarioHistoryId = 1
const healthyHistory: HistoryEntry[] = [
  mkHist(dateNDaysAgo(12), '09:00:00', 'session', 'Progressive Overload Principles'),
  mkHist(dateNDaysAgo(11), '09:15:00', 'session', 'Sleep Architecture'),
  mkHist(dateNDaysAgo(11), '15:30:00', 'session', 'Zone 2 Cardio Protocols'),
  mkHist(dateNDaysAgo(10), '08:45:00', 'session', 'Foam Rolling Techniques'),
  mkHist(dateNDaysAgo(10), '14:00:00', 'protocol', 'Morning Routine v3'),
  mkHist(dateNDaysAgo(9), '09:30:00', 'session', 'HIIT Training Methodology'),
  mkHist(dateNDaysAgo(8), '08:15:00', 'session', 'Heart Rate Variability'),
  mkHist(dateNDaysAgo(8), '17:00:00', 'session', 'Breathwork Fundamentals'),
  mkHist(dateNDaysAgo(7), '10:00:00', 'session', 'Mobility for Lifters'),
  mkHist(dateNDaysAgo(6), '09:00:00', 'session', 'Active Recovery Methods'),
  mkHist(dateNDaysAgo(6), '13:30:00', 'session', 'Nutrition Timing'),
  mkHist(dateNDaysAgo(5), '08:30:00', 'session', 'Deadlift Form Deep Dive'),
  mkHist(dateNDaysAgo(4), '09:45:00', 'session', 'Contrast Therapy'),
  mkHist(dateNDaysAgo(3), '10:15:00', 'session', 'Post-workout Cooldown'),
  mkHist(dateNDaysAgo(2), '09:00:00', 'session', 'Circadian Rhythm Basics'),
  mkHist(dateNDaysAgo(1), '08:45:00', 'session', 'Recovery Nutrition'),
  mkHist(dateNDaysAgo(0), '09:15:00', 'session', 'Hydration Strategies'),
]

const healthyDailyActivity: Record<string, number> = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => [
    dateNDaysAgo(i),
    [5, 6, 4, 7, 5, 8, 6, 5, 4, 7, 6, 5, 8, 4, 6, 5, 7, 6, 4, 5, 6, 8, 5, 6, 4, 7, 5, 6, 5, 7][i] ?? 5,
  ]),
)

export const healthyScenario: DemoScenario = {
  id: 'healthy',
  displayName: 'Healthy Consistency',
  description: 'Strong 12-day streak, zero review debt, solid confidence across the board',
  icon: '💪',
  profile: PROFILE_JOHN,
  analytics: {
    overview: {
      total_topics: 89,
      total_sessions: 17,
      current_streak: 12,
      longest_streak: 18,
      this_week: 34,
      due_reviews: 0,
    },
    confidence_distribution: { mastered: 28, strong: 55, learning: 5, weak: 1 },
    topics: demoAnalytics.topics,
    due_reviews: [],
    weekly_totals: [
      { week: 'Jan 26', total: 8, current: false },
      { week: 'Feb 02', total: 12, current: false },
      { week: 'Feb 09', total: 15, current: false },
      { week: 'Feb 16', total: 18, current: false },
      { week: 'Feb 23', total: 20, current: false },
      { week: 'Mar 01', total: 22, current: false },
      { week: 'Mar 08', total: 25, current: false },
      { week: 'Mar 15', total: 28, current: false },
      { week: 'Mar 22', total: 30, current: false },
      { week: 'Mar 29', total: 32, current: false },
      { week: 'Apr 06', total: 31, current: false },
      { week: 'Apr 13', total: 34, current: true },
    ],
    daily_activity: healthyDailyActivity,
  },
  topics: demoTopicsJohn,
  history: healthyHistory,
  insights: {
    insights: [
      {
        title: 'Twelve-day streak — momentum is real',
        body: 'You have shipped 17 sessions across 12 unbroken days. This is the zone where spaced repetition compounds — keep the cadence.',
      },
      {
        title: 'Zero review debt — time to push',
        body: 'No overdue reviews + 55 topics at strong confidence means you have headroom to add advanced material rather than grinding existing topics.',
      },
      {
        title: 'Consider a periodization block',
        body: 'Your topic mix is heavy on foundational training. A 3-week focused block on a specific lift or recovery modality would sharpen weak spots (VO2 max, lactate threshold).',
      },
    ],
    model: 'claude-sonnet-4-20250514',
    generated_at: new Date().toISOString(),
  },
  signals: {
    weeklySessions: 17,
    topEvents: [
      { event: 'heatmap_day_clicked', count: 52 },
      { event: 'topic_expanded', count: 38 },
      { event: 'insights_generated', count: 11 },
      { event: 'profile_switched', count: 9 },
      { event: 'refresh_clicked', count: 6 },
    ],
    lastActivityTs: Math.floor(Date.now() / 1000) - 42,
    source: 'demo',
  },
}

// -------- Scenario 2: Review Debt Crisis --------
_scenarioHistoryId = 1
const reviewDebtOverdueTopics: Topic[] = [
  mkTopic('canning basics', 0.38, 2, 26, -6),
  mkTopic('pressure canning', 0.25, 1, 4, -5),
  mkTopic('water filtration', 0.35, 1, 5, -5),
  mkTopic('water bath canning', 0.28, 1, 8, -4),
  mkTopic('fermentation', 0.3, 2, 38, -3),
  mkTopic('root cellar', 0.22, 1, 9, -3),
  mkTopic('food preservation', 0.32, 1, 8, -2),
  mkTopic('seed saving', 0.28, 1, 7, -2),
  mkTopic('dehydrating', 0.42, 1, 28, -1),
  mkTopic('lacto-fermentation', 0.35, 1, 24, -1),
  mkTopic('chicken coops', 0.5, 2, 15, 0),
  mkTopic('pickling', 0.45, 1, 20, 0),
]

const reviewDebtHistory: HistoryEntry[] = [
  mkHist(dateNDaysAgo(15), '10:00:00', 'session', 'Sourdough Starter Maintenance'),
  mkHist(dateNDaysAgo(13), '09:30:00', 'session', 'Raised Bed Planning'),
  mkHist(dateNDaysAgo(12), '14:00:00', 'session', 'Composting Fundamentals'),
  mkHist(dateNDaysAgo(9), '11:15:00', 'session', 'Chicken Flock Basics'),
  mkHist(dateNDaysAgo(8), '10:45:00', 'session', 'Pickling Cucumbers'),
  // Gap of silence for 8 days — this is the crisis pattern
]

const reviewDebtDailyActivity: Record<string, number> = {
  [dateNDaysAgo(15)]: 3,
  [dateNDaysAgo(13)]: 4,
  [dateNDaysAgo(12)]: 2,
  [dateNDaysAgo(9)]: 3,
  [dateNDaysAgo(8)]: 2,
  // Silent since
}

export const reviewDebtScenario: DemoScenario = {
  id: 'review_debt',
  displayName: 'Review Debt Crisis',
  description: '12 overdue reviews, streak broken 8 days ago, confidence slipping — prime Automations trigger zone',
  icon: '⚠️',
  profile: PROFILE_JANE,
  analytics: {
    overview: {
      total_topics: 57,
      total_sessions: 5,
      current_streak: 0,
      longest_streak: 8,
      this_week: 0,
      due_reviews: 12,
    },
    confidence_distribution: { mastered: 3, strong: 16, learning: 22, weak: 16 },
    topics: demoAnalyticsJane.topics,
    due_reviews: reviewDebtOverdueTopics,
    weekly_totals: [
      { week: 'Jan 26', total: 3, current: false },
      { week: 'Feb 02', total: 6, current: false },
      { week: 'Feb 09', total: 5, current: false },
      { week: 'Feb 16', total: 8, current: false },
      { week: 'Feb 23', total: 7, current: false },
      { week: 'Mar 01', total: 9, current: false },
      { week: 'Mar 08', total: 6, current: false },
      { week: 'Mar 15', total: 4, current: false },
      { week: 'Mar 22', total: 3, current: false },
      { week: 'Mar 29', total: 2, current: false },
      { week: 'Apr 06', total: 1, current: false },
      { week: 'Apr 13', total: 0, current: true },
    ],
    daily_activity: reviewDebtDailyActivity,
  },
  topics: demoTopicsJane,
  history: reviewDebtHistory,
  insights: {
    insights: [
      {
        title: 'Twelve overdue reviews need attention today',
        body: 'Canning basics, pressure canning, and water filtration are all at 25-38% confidence and past their review dates. These topics will fully decay without a review session this week.',
      },
      {
        title: 'Eight-day silence — break it small',
        body: 'Your last activity was 8 days ago. Dont try to catch up all 12 overdue topics at once. Pick the 3 at lowest confidence (pressure canning, water filtration, water bath canning) and do a 15-minute session today.',
      },
      {
        title: 'Confidence is drifting — 16 topics now at weak',
        body: 'A month ago you had 6 weak topics; now 16. This is the cost of the gap. Prioritize review cycles over new material until the weak count is back under 10.',
      },
    ],
    model: 'claude-sonnet-4-20250514',
    generated_at: new Date().toISOString(),
  },
  signals: {
    weeklySessions: 2,
    topEvents: [
      { event: 'heatmap_day_clicked', count: 8 },
      { event: 'refresh_clicked', count: 5 },
      { event: 'topic_expanded', count: 3 },
      { event: 'insights_generated', count: 2 },
    ],
    lastActivityTs: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 8,
    source: 'demo',
  },
}

// -------- Scenario 3: Onboarding --------
_scenarioHistoryId = 1
const onboardingTopics: Topic[] = [
  mkTopic('goal setting', 0.55, 1, 2, 1),
  mkTopic('habit stacking', 0.48, 1, 2, 1),
  mkTopic('minimum viable workout', 0.42, 1, 1, 2),
  mkTopic('protein intake basics', 0.38, 1, 1, 2),
]

export const onboardingScenario: DemoScenario = {
  id: 'onboarding',
  displayName: 'Onboarding (Day 2)',
  description: 'Brand new user, 4 topics learned, just getting momentum',
  icon: '🌱',
  profile: PROFILE_TAYLOR,
  analytics: {
    overview: {
      total_topics: 4,
      total_sessions: 2,
      current_streak: 2,
      longest_streak: 2,
      this_week: 4,
      due_reviews: 0,
    },
    confidence_distribution: { mastered: 0, strong: 0, learning: 4, weak: 0 },
    topics: onboardingTopics,
    due_reviews: [],
    weekly_totals: [
      ...Array.from({ length: 11 }, (_, i) => ({
        week: ['Jan 26', 'Feb 02', 'Feb 09', 'Feb 16', 'Feb 23', 'Mar 01', 'Mar 08', 'Mar 15', 'Mar 22', 'Mar 29', 'Apr 06'][i] ?? '',
        total: 0,
        current: false,
      })),
      { week: 'Apr 13', total: 4, current: true },
    ],
    daily_activity: {
      [dateNDaysAgo(1)]: 2,
      [dateNDaysAgo(0)]: 2,
    },
  },
  topics: onboardingTopics,
  history: [
    mkHist(dateNDaysAgo(1), '09:30:00', 'session', 'Goal Setting — SMART Goals'),
    mkHist(dateNDaysAgo(1), '15:00:00', 'session', 'Habit Stacking Fundamentals'),
    mkHist(dateNDaysAgo(0), '08:45:00', 'session', 'Minimum Viable Workout'),
    mkHist(dateNDaysAgo(0), '14:30:00', 'session', 'Protein Intake Basics'),
  ],
  insights: {
    insights: [
      {
        title: 'Two-day streak — protect the chain',
        body: 'You are 2 days in with 4 topics. The next 5 days matter most for habit formation. Even a single 5-minute session keeps the streak alive.',
      },
      {
        title: 'All four topics at learning level',
        body: 'This is exactly right for day 2. Your goal is not mastery yet — it is exposure. Next reviews are scheduled for tomorrow.',
      },
    ],
    model: 'claude-sonnet-4-20250514',
    generated_at: new Date().toISOString(),
  },
  signals: {
    weeklySessions: 1,
    topEvents: [
      { event: 'insights_generated', count: 2 },
      { event: 'refresh_clicked', count: 3 },
    ],
    lastActivityTs: Math.floor(Date.now() / 1000) - 60 * 45,
    source: 'demo',
  },
}

// -------- Scenario 4: Power User --------
_scenarioHistoryId = 1

const powerUserDailyActivity: Record<string, number> = Object.fromEntries(
  Array.from({ length: 60 }, (_, i) => [
    dateNDaysAgo(i),
    [12, 8, 14, 10, 11, 9, 15, 13, 7, 12, 11, 14, 9, 10, 13, 8, 12, 15, 11, 10, 14, 9, 13, 11, 8, 12, 14, 10, 11, 13, 9, 15, 8, 12, 11, 13, 10, 14, 9, 12, 8, 13, 11, 10, 14, 12, 9, 13, 11, 8, 12, 14, 10, 11, 15, 9, 12, 13, 10, 11][i] ?? 10,
  ]),
)

const powerUserHistory: HistoryEntry[] = Array.from({ length: 35 }, (_, i) => {
  const topics = [
    'Power Clean Technique', 'Volume Landmarks', 'Periodization Advanced',
    'RPE Autoregulation', 'Meta-Cycles', 'Deload Optimization',
    'Fatigue Management', 'Peak Performance Windows', 'CNS Recovery',
    'Advanced Programming', 'Training to Failure', 'Drop Sets Science',
    'Blood Flow Restriction', 'Isometric Training', 'Tempo Work',
    'Accommodating Resistance', 'Cluster Sets', 'Rest-Pause Training',
    'Pre-Exhaust Methods', 'Partial Reps', 'Eccentric Overload',
    'Concentric Acceleration', 'Velocity-Based Training', 'Power Output',
    'Reactive Strength', 'Stretch-Shortening Cycle', 'Ballistic Training',
    'Plyometric Progression', 'Olympic Lift Variations', 'Snatch Technique',
    'Clean and Jerk', 'Front Squat Programming', 'Back Squat Variations',
    'Romanian Deadlift Cues', 'Sumo vs Conventional',
  ]
  const daysAgo = Math.floor(i / 1.5)
  const hour = 8 + (i % 3) * 3
  return mkHist(
    dateNDaysAgo(daysAgo),
    `${String(hour).padStart(2, '0')}:${(i * 7) % 60}:00`,
    i % 4 === 0 ? 'protocol' : 'session',
    topics[i] ?? `Advanced Topic ${i + 1}`,
  )
})

export const powerUserScenario: DemoScenario = {
  id: 'power_user',
  displayName: 'Power User',
  description: '247 topics, 43-day streak, dense daily activity — the "advanced user" demo',
  icon: '🔥',
  profile: PROFILE_JOHN,
  analytics: {
    overview: {
      total_topics: 247,
      total_sessions: 89,
      current_streak: 43,
      longest_streak: 43,
      this_week: 71,
      due_reviews: 3,
    },
    confidence_distribution: { mastered: 89, strong: 142, learning: 14, weak: 2 },
    topics: demoAnalytics.topics,
    due_reviews: [
      mkTopic('isometric holds', 0.58, 2, 14, 0),
      mkTopic('velocity-based training', 0.52, 2, 10, 0),
      mkTopic('accommodating resistance', 0.48, 1, 7, 0),
    ],
    weekly_totals: [
      { week: 'Jan 26', total: 42, current: false },
      { week: 'Feb 02', total: 51, current: false },
      { week: 'Feb 09', total: 48, current: false },
      { week: 'Feb 16', total: 55, current: false },
      { week: 'Feb 23', total: 58, current: false },
      { week: 'Mar 01', total: 62, current: false },
      { week: 'Mar 08', total: 67, current: false },
      { week: 'Mar 15', total: 65, current: false },
      { week: 'Mar 22', total: 69, current: false },
      { week: 'Mar 29', total: 72, current: false },
      { week: 'Apr 06', total: 68, current: false },
      { week: 'Apr 13', total: 71, current: true },
    ],
    daily_activity: powerUserDailyActivity,
  },
  topics: demoTopicsJohn,
  history: powerUserHistory,
  insights: {
    insights: [
      {
        title: 'You are in elite-tier territory — specialize now',
        body: '247 topics with 89 mastered and a 43-day streak puts you in the top 1% of users. Your ROI shifts from breadth to depth: pick one sub-domain (velocity training, periodization, or recovery systems) and go vertical.',
      },
      {
        title: 'Three overdue reviews at mid-confidence — quick wins',
        body: 'Isometric holds, velocity-based training, and accommodating resistance are hovering at 48-58%. Knocking these out today would add 3 to your strong count and keep the streak clean.',
      },
      {
        title: 'Weekly volume is flat — intentional or plateau?',
        body: 'Activity is stable at 65-72 topics/week for 8 weeks. If this is a deliberate maintenance phase, great. If it is a plateau, consider introducing a harder specialization block — your base can handle it.',
      },
    ],
    model: 'claude-sonnet-4-20250514',
    generated_at: new Date().toISOString(),
  },
  signals: {
    weeklySessions: 28,
    topEvents: [
      { event: 'heatmap_day_clicked', count: 184 },
      { event: 'topic_expanded', count: 147 },
      { event: 'insights_generated', count: 42 },
      { event: 'profile_switched', count: 31 },
      { event: 'refresh_clicked', count: 28 },
    ],
    lastActivityTs: Math.floor(Date.now() / 1000) - 18,
    source: 'demo',
  },
}

// -------- Scenario 5: Burnout Incoming --------
_scenarioHistoryId = 1

const burnoutDailyActivity: Record<string, number> = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => {
    // High activity 25-30 days ago, steady decline to now
    const values = [
      2, 3, 2, 1, 3, 2, 1, 2, 3, 2,  // Last 10 days — low
      4, 5, 4, 5, 6, 5, 4, 6, 5, 4,  // 10-19 days ago — moderate
      8, 10, 9, 11, 10, 9, 12, 10, 9, 11, // 20-29 days ago — high
    ]
    return [dateNDaysAgo(i), values[i] ?? 5]
  }),
)

const burnoutHistory: HistoryEntry[] = [
  mkHist(dateNDaysAgo(0), '09:00:00', 'session', 'Quick Review'),
  mkHist(dateNDaysAgo(1), '10:30:00', 'session', 'Mobility Work'),
  mkHist(dateNDaysAgo(3), '09:15:00', 'session', 'Recovery Nutrition'),
  mkHist(dateNDaysAgo(4), '09:45:00', 'session', 'Sleep Hygiene'),
  mkHist(dateNDaysAgo(6), '08:30:00', 'session', 'Zone 2 Cardio'),
  mkHist(dateNDaysAgo(8), '09:00:00', 'session', 'Foam Rolling'),
  mkHist(dateNDaysAgo(11), '10:15:00', 'protocol', 'Weekly Review'),
  mkHist(dateNDaysAgo(14), '09:30:00', 'session', 'HIIT Protocol'),
  mkHist(dateNDaysAgo(18), '08:45:00', 'session', 'Power Clean'),
  mkHist(dateNDaysAgo(22), '10:00:00', 'session', 'Periodization'),
  mkHist(dateNDaysAgo(25), '08:30:00', 'session', 'RPE Training'),
]

export const burnoutScenario: DemoScenario = {
  id: 'burnout_incoming',
  displayName: 'Burnout Incoming',
  description: '14-day streak still live, but activity trending sharply down — Workflows should warn',
  icon: '📉',
  profile: PROFILE_JOHN,
  analytics: {
    overview: {
      total_topics: 112,
      total_sessions: 11,
      current_streak: 14,
      longest_streak: 21,
      this_week: 12,
      due_reviews: 4,
    },
    confidence_distribution: { mastered: 22, strong: 68, learning: 18, weak: 4 },
    topics: demoAnalytics.topics,
    due_reviews: [
      mkTopic('power clean technique', 0.58, 2, 18, 0),
      mkTopic('periodization', 0.54, 2, 22, 0),
      mkTopic('rpe training', 0.52, 2, 25, 0),
      mkTopic('fatigue management', 0.48, 1, 10, 0),
    ],
    weekly_totals: [
      { week: 'Jan 26', total: 22, current: false },
      { week: 'Feb 02', total: 28, current: false },
      { week: 'Feb 09', total: 35, current: false },
      { week: 'Feb 16', total: 42, current: false },
      { week: 'Feb 23', total: 48, current: false },
      { week: 'Mar 01', total: 52, current: false },
      { week: 'Mar 08', total: 58, current: false },
      { week: 'Mar 15', total: 54, current: false },
      { week: 'Mar 22', total: 45, current: false },
      { week: 'Mar 29', total: 32, current: false },
      { week: 'Apr 06', total: 22, current: false },
      { week: 'Apr 13', total: 12, current: true },
    ],
    daily_activity: burnoutDailyActivity,
  },
  topics: demoTopicsJohn,
  history: burnoutHistory,
  insights: {
    insights: [
      {
        title: 'Weekly volume has halved — check in with yourself',
        body: 'Three weeks ago you were at 52 topics/week. This week: 12. The streak is technically alive, but the trajectory says burnout. Is training load high? Sleep bad? Life stress? Name it.',
      },
      {
        title: 'Four overdue reviews at mid-confidence',
        body: 'Power clean, periodization, RPE training, and fatigue management are all hovering at 48-58% with review dates today. These are the first topics to drop if you skip another day.',
      },
      {
        title: 'Consider a deliberate deload — for the habit, not the training',
        body: 'A pre-planned 3-day "streak but minimal" phase — one 5-minute topic review per day — protects the habit while acknowledging you are not at full capacity right now. Better than a broken streak.',
      },
    ],
    model: 'claude-sonnet-4-20250514',
    generated_at: new Date().toISOString(),
  },
  signals: {
    weeklySessions: 6,
    topEvents: [
      { event: 'heatmap_day_clicked', count: 31 },
      { event: 'topic_expanded', count: 18 },
      { event: 'refresh_clicked', count: 14 },
      { event: 'insights_generated', count: 8 },
    ],
    lastActivityTs: Math.floor(Date.now() / 1000) - 60 * 90,
    source: 'demo',
  },
}

// -------- The scenario catalog --------

export const demoScenarios: Record<DemoScenarioId, DemoScenario> = {
  healthy: healthyScenario,
  review_debt: reviewDebtScenario,
  onboarding: onboardingScenario,
  power_user: powerUserScenario,
  burnout_incoming: burnoutScenario,
}

export const DEFAULT_SCENARIO_ID: DemoScenarioId = 'healthy'

export const SCENARIO_ORDER: readonly DemoScenarioId[] = [
  'healthy',
  'power_user',
  'burnout_incoming',
  'review_debt',
  'onboarding',
]
