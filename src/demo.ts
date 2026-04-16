import type {
  Analytics,
  HistoryEntry,
  InsightsResponse,
  Profile,
  Topic,
} from './types'

export const demoProfiles: Profile[] = [
  { id: 1, name: 'john', display_name: 'John' },
  { id: 2, name: 'jane', display_name: 'Jane' },
]

export const demoAnalytics: Analytics = {
  overview: {
    total_topics: 89,
    total_sessions: 2,
    current_streak: 1,
    longest_streak: 1,
    this_week: 89,
    due_reviews: 2,
  },
  confidence_distribution: {
    mastered: 18,
    strong: 62,
    learning: 7,
    weak: 2,
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
  due_reviews: [
    {
      name: 'red light',
      first_learned: '2026-04-13T17:43:20.095781',
      last_reviewed: '2026-04-13T17:52:35.965871',
      review_count: 1,
      confidence_score: 0.28,
      next_review: '2026-04-14T17:52:35.965908',
    },
    {
      name: 'parasympathetic',
      first_learned: '2026-04-13T17:43:20.095781',
      last_reviewed: '2026-04-13T17:52:35.961059',
      review_count: 1,
      confidence_score: 0.22,
      next_review: '2026-04-15T17:52:35.961096',
    },
  ],
  daily_activity: {
    // Sporadic early usage (late Jan / Feb)
    '2026-01-20': 2,
    '2026-01-27': 1,
    '2026-02-03': 3,
    '2026-02-08': 1,
    '2026-02-14': 2,
    '2026-02-21': 5,
    // Starting to ramp (Mar)
    '2026-03-01': 4,
    '2026-03-03': 7,
    '2026-03-08': 3,
    '2026-03-10': 11,
    '2026-03-14': 8,
    '2026-03-15': 6,
    '2026-03-19': 14,
    '2026-03-22': 9,
    '2026-03-25': 12,
    '2026-03-28': 19,
    '2026-03-29': 5,
    '2026-03-31': 23,
    // Heavy usage (Apr)
    '2026-04-01': 15,
    '2026-04-03': 28,
    '2026-04-05': 10,
    '2026-04-06': 31,
    '2026-04-07': 42,
    '2026-04-09': 18,
    '2026-04-10': 35,
    '2026-04-12': 50,
    '2026-04-13': 89,
    '2026-04-14': 12,
  },
  weekly_totals: [
    { week: 'Jan 26', total: 2, current: false },
    { week: 'Feb 02', total: 5, current: false },
    { week: 'Feb 09', total: 8, current: false },
    { week: 'Feb 16', total: 11, current: false },
    { week: 'Feb 23', total: 7, current: false },
    { week: 'Mar 01', total: 14, current: false },
    { week: 'Mar 08', total: 19, current: false },
    { week: 'Mar 15', total: 23, current: false },
    { week: 'Mar 22', total: 28, current: false },
    { week: 'Mar 29', total: 31, current: false },
    { week: 'Apr 06', total: 42, current: false },
    { week: 'Apr 13', total: 89, current: true },
  ],
}

export const demoAnalyticsJane: Analytics = {
  overview: {
    total_topics: 57,
    total_sessions: 4,
    current_streak: 3,
    longest_streak: 5,
    this_week: 14,
    due_reviews: 4,
  },
  confidence_distribution: {
    mastered: 8,
    strong: 31,
    learning: 12,
    weak: 6,
  },
  topics: [
    {
      name: 'sourdough starter',
      first_learned: '2026-02-10T10:15:00.000000',
      last_reviewed: '2026-04-12T09:30:00.000000',
      review_count: 6,
      confidence_score: 0.92,
      next_review: '2026-06-10T09:30:00.000000',
    },
    {
      name: 'composting',
      first_learned: '2026-02-14T14:00:00.000000',
      last_reviewed: '2026-04-10T11:00:00.000000',
      review_count: 5,
      confidence_score: 0.85,
      next_review: '2026-05-18T11:00:00.000000',
    },
    {
      name: 'raised beds',
      first_learned: '2026-03-01T08:30:00.000000',
      last_reviewed: '2026-04-13T08:45:00.000000',
      review_count: 3,
      confidence_score: 0.72,
      next_review: '2026-04-20T08:45:00.000000',
    },
    {
      name: 'seed starting',
      first_learned: '2026-03-05T09:00:00.000000',
      last_reviewed: '2026-04-11T10:15:00.000000',
      review_count: 3,
      confidence_score: 0.68,
      next_review: '2026-04-18T10:15:00.000000',
    },
    {
      name: 'fermentation',
      first_learned: '2026-03-08T16:00:00.000000',
      last_reviewed: '2026-04-09T14:30:00.000000',
      review_count: 2,
      confidence_score: 0.6,
      next_review: '2026-04-16T14:30:00.000000',
    },
    {
      name: 'canning basics',
      first_learned: '2026-03-20T11:00:00.000000',
      last_reviewed: '2026-04-08T12:00:00.000000',
      review_count: 2,
      confidence_score: 0.55,
      next_review: '2026-04-15T12:00:00.000000',
    },
    {
      name: 'chicken coops',
      first_learned: '2026-04-01T07:30:00.000000',
      last_reviewed: '2026-04-13T08:00:00.000000',
      review_count: 2,
      confidence_score: 0.5,
      next_review: '2026-04-17T08:00:00.000000',
    },
    {
      name: 'water filtration',
      first_learned: '2026-04-10T15:00:00.000000',
      last_reviewed: '2026-04-10T15:00:00.000000',
      review_count: 1,
      confidence_score: 0.35,
      next_review: '2026-04-13T15:00:00.000000',
    },
  ],
  due_reviews: [
    {
      name: 'canning basics',
      first_learned: '2026-03-20T11:00:00.000000',
      last_reviewed: '2026-04-08T12:00:00.000000',
      review_count: 2,
      confidence_score: 0.55,
      next_review: '2026-04-15T12:00:00.000000',
    },
    {
      name: 'water filtration',
      first_learned: '2026-04-10T15:00:00.000000',
      last_reviewed: '2026-04-10T15:00:00.000000',
      review_count: 1,
      confidence_score: 0.35,
      next_review: '2026-04-13T15:00:00.000000',
    },
    {
      name: 'fermentation',
      first_learned: '2026-03-08T16:00:00.000000',
      last_reviewed: '2026-04-09T14:30:00.000000',
      review_count: 2,
      confidence_score: 0.6,
      next_review: '2026-04-16T14:30:00.000000',
    },
    {
      name: 'chicken coops',
      first_learned: '2026-04-01T07:30:00.000000',
      last_reviewed: '2026-04-13T08:00:00.000000',
      review_count: 2,
      confidence_score: 0.5,
      next_review: '2026-04-17T08:00:00.000000',
    },
  ],
  daily_activity: {
    '2026-02-10': 3,
    '2026-02-14': 2,
    '2026-02-22': 4,
    '2026-03-01': 5,
    '2026-03-05': 3,
    '2026-03-08': 4,
    '2026-03-12': 2,
    '2026-03-15': 6,
    '2026-03-20': 5,
    '2026-03-25': 3,
    '2026-03-28': 7,
    '2026-04-01': 4,
    '2026-04-03': 5,
    '2026-04-06': 3,
    '2026-04-08': 6,
    '2026-04-09': 4,
    '2026-04-10': 8,
    '2026-04-11': 3,
    '2026-04-12': 5,
    '2026-04-13': 9,
    '2026-04-14': 5,
  },
  weekly_totals: [
    { week: 'Jan 26', total: 0, current: false },
    { week: 'Feb 02', total: 0, current: false },
    { week: 'Feb 09', total: 5, current: false },
    { week: 'Feb 16', total: 0, current: false },
    { week: 'Feb 23', total: 4, current: false },
    { week: 'Mar 01', total: 8, current: false },
    { week: 'Mar 08', total: 6, current: false },
    { week: 'Mar 15', total: 6, current: false },
    { week: 'Mar 22', total: 10, current: false },
    { week: 'Mar 29', total: 7, current: false },
    { week: 'Apr 06', total: 26, current: false },
    { week: 'Apr 13', total: 14, current: true },
  ],
}

export const demoInsightsJane: InsightsResponse = {
  insights: [
    {
      title: 'Four reviews overdue — tackle them first',
      body: 'Canning basics, water filtration, fermentation, and chicken coops are all past their review dates. A quick 15-minute review session would prevent confidence decay.',
    },
    {
      title: 'Homesteading momentum building nicely',
      body: 'Three consecutive days of activity and a 3-day streak. Your consistency in the last two weeks is noticeably stronger than February — keep this cadence.',
    },
    {
      title: 'Water filtration needs reinforcement',
      body: 'At 35% confidence with only one review, this topic is at risk of dropping out of memory entirely. Revisit it before the weekend.',
    },
  ],
  model: 'claude-sonnet-4-20250514',
  generated_at: '2026-04-15T12:00:00.000000+00:00',
}

export const demoHistory: HistoryEntry[] = [
  {
    id: 1,
    session_type: 'session',
    topic: 'Cold Therapy for Recovery — An Elite-Level Deep Dive',
    prompt: 'Deep dive into cold exposure protocols for athletic recovery...',
    response: 'Cold therapy leverages vasoconstriction and the mammalian dive reflex to reduce inflammation...',
    notes: null,
    created_at: '2026-04-13T16:16:33.037600',
  },
  {
    id: 2,
    session_type: 'session',
    topic: 'Lean Weight Gain Protocol for Hardgainers',
    prompt: 'Systematic approach to lean bulking for ectomorphic body types...',
    response: 'The fundamental challenge for hardgainers is not training stimulus but caloric throughput...',
    notes: null,
    created_at: '2026-04-13T17:43:20.095781',
  },
  {
    id: 3,
    session_type: 'session',
    topic: 'Barbell Strength Training — An Elite-Level Deep Dive',
    prompt: 'The barbell is the single most effective tool for building maximal strength...',
    response: 'Progressive overload through compound barbell movements remains the gold standard...',
    notes: null,
    created_at: '2026-04-14T14:30:00.000000',
  },
  {
    id: 4,
    session_type: 'protocol',
    topic: 'Building Protocols — Morning Routines, Pre-Workout, Recovery, and Sleep',
    prompt: 'A systematic approach to building daily performance protocols...',
    response: 'Consistency is not willpower. It is architecture. Protocols are fixed sequences...',
    notes: null,
    created_at: '2026-04-14T15:00:00.000000',
  },
]

export const demoHistoryJane: HistoryEntry[] = [
  {
    id: 1,
    session_type: 'session',
    topic: 'Sourdough Starter Maintenance and Troubleshooting',
    prompt: 'Complete guide to maintaining a healthy sourdough culture...',
    response: 'A sourdough starter is a symbiotic colony of wild yeast and lactic acid bacteria...',
    notes: null,
    created_at: '2026-04-12T09:30:00.000000',
  },
  {
    id: 2,
    session_type: 'session',
    topic: 'Raised Bed Garden Planning for Zone 7',
    prompt: 'Designing a productive raised bed garden layout...',
    response: 'Zone 7 provides a generous growing season from April through October...',
    notes: null,
    created_at: '2026-04-13T08:45:00.000000',
  },
  {
    id: 3,
    session_type: 'session',
    topic: 'Backyard Chicken Coop Design and Flock Management',
    prompt: 'Everything you need to know about keeping a small backyard flock...',
    response: 'Start with 4-6 hens for a family of four. Each hen produces roughly 250 eggs per year...',
    notes: null,
    created_at: '2026-04-13T14:00:00.000000',
  },
  {
    id: 4,
    session_type: 'session',
    topic: 'Water Filtration Systems for Off-Grid Living',
    prompt: 'Comparison of gravity-fed, UV, and reverse osmosis filtration...',
    response: 'For off-grid scenarios, gravity-fed ceramic filters offer the best reliability-to-cost ratio...',
    notes: null,
    created_at: '2026-04-10T15:00:00.000000',
  },
]

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

// ---------- Full topic catalogs (used by /api/topics explorer) ----------
//
// demoAnalytics.topics is a sample (matches SAPA's truncated analytics response).
// These are the full catalogs TopicsExplorer renders — same shape, realistic volume.

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

export const demoTopicsJohn: Topic[] = [
  mkTopic('foam rolling', 0.83, 4, 30, 37),
  mkTopic('zone 2', 0.83, 4, 30, 37),
  mkTopic('squat', 0.83, 4, 30, 37),
  mkTopic('hiit', 0.83, 4, 30, 37),
  mkTopic('protocol', 0.83, 4, 30, 37),
  mkTopic('sleep', 0.83, 4, 30, 37),
  mkTopic('cardio', 0.83, 4, 30, 37),
  mkTopic('hypertrophy', 0.83, 4, 30, 37),
  mkTopic('rdl', 0.83, 4, 30, 37),
  mkTopic('les', 0.83, 4, 30, 37),
  mkTopic('deep sleep', 0.83, 4, 30, 37),
  mkTopic('mobility', 0.83, 4, 30, 37),
  mkTopic('calories', 0.83, 4, 30, 37),
  mkTopic('cortisol', 0.83, 4, 30, 37),
  mkTopic('walking', 0.83, 4, 30, 37),
  mkTopic('bench press', 0.75, 2, 25, 14),
  mkTopic('deadlift', 0.75, 2, 25, 14),
  mkTopic('overhead press', 0.75, 2, 25, 14),
  mkTopic('power clean', 0.75, 2, 25, 14),
  mkTopic('rpe', 0.75, 2, 25, 14),
  mkTopic('progressive overload', 0.75, 2, 25, 14),
  mkTopic('hyperventilation', 0.7, 1, 3, 1),
  mkTopic('ice bath', 0.7, 1, 3, 1),
  mkTopic('activation', 0.7, 1, 3, 1),
  mkTopic('contrast therapy', 0.7, 1, 3, 1),
  mkTopic('anti-inflammatory', 0.7, 1, 3, 1),
  mkTopic('intensity', 0.7, 1, 3, 1),
  mkTopic('resistance training', 0.7, 1, 3, 1),
  mkTopic('breathwork', 0.7, 1, 3, 1),
  mkTopic('rom', 0.7, 1, 3, 1),
  mkTopic('meditation', 0.7, 1, 3, 1),
  mkTopic('sympathetic', 0.7, 1, 3, 1),
  mkTopic('vo2 max', 0.45, 1, 10, 0),
  mkTopic('lactate threshold', 0.4, 1, 10, 0),
  mkTopic('mitochondria', 0.38, 1, 10, 0),
  mkTopic('ATP', 0.36, 1, 10, 0),
  mkTopic('fast-twitch fibers', 0.32, 1, 12, 0),
  mkTopic('red light', 0.28, 1, 3, -1),
  mkTopic('parasympathetic', 0.22, 1, 3, -1),
]

export const demoTopicsJane: Topic[] = [
  mkTopic('sourdough starter', 0.92, 6, 65, 55),
  mkTopic('composting', 0.85, 5, 60, 32),
  mkTopic('raised beds', 0.72, 3, 45, 4),
  mkTopic('seed starting', 0.68, 3, 40, 2),
  mkTopic('fermentation', 0.6, 2, 38, 0),
  mkTopic('canning basics', 0.55, 2, 26, -1),
  mkTopic('chicken coops', 0.5, 2, 15, 1),
  mkTopic('companion planting', 0.48, 2, 20, 3),
  mkTopic('mulching', 0.44, 1, 18, 5),
  mkTopic('crop rotation', 0.42, 1, 22, 5),
  mkTopic('water filtration', 0.35, 1, 5, -3),
  mkTopic('food preservation', 0.32, 1, 8, -2),
  mkTopic('root cellar', 0.3, 1, 9, -1),
  mkTopic('seed saving', 0.28, 1, 7, -1),
  mkTopic('pressure canning', 0.25, 1, 4, 0),
  mkTopic('water bath canning', 0.58, 2, 30, 6),
  mkTopic('dehydrating', 0.52, 2, 28, 7),
  mkTopic('pickling', 0.6, 3, 35, 10),
  mkTopic('lacto-fermentation', 0.55, 2, 24, 4),
  mkTopic('kombucha', 0.48, 2, 20, 6),
  mkTopic('bread baking', 0.88, 8, 75, 40),
  mkTopic('pie crust', 0.78, 4, 50, 22),
  mkTopic('meal planning', 0.82, 5, 55, 28),
  mkTopic('herbs', 0.7, 3, 35, 12),
  mkTopic('drip irrigation', 0.5, 2, 20, 8),
  mkTopic('soil ph', 0.42, 1, 15, 3),
  mkTopic('cover crops', 0.4, 1, 18, 4),
  mkTopic('no-till gardening', 0.62, 2, 30, 10),
]

// ---------- Per-profile demo bundle ----------
//
// Replaces the old isJane() hardcode. To add a third profile, add a row
// here and the rest of the app picks it up automatically.

export type ProfileDemoData = {
  readonly analytics: Analytics
  readonly topics: readonly Topic[]
  readonly history: readonly HistoryEntry[]
  readonly insights: InsightsResponse
}

export const demoDataByProfile: Record<number, ProfileDemoData> = {
  1: {
    analytics: demoAnalytics,
    topics: demoTopicsJohn,
    history: demoHistory,
    insights: demoInsights,
  },
  2: {
    analytics: demoAnalyticsJane,
    topics: demoTopicsJane,
    history: demoHistoryJane,
    insights: demoInsightsJane,
  },
}

export const DEFAULT_DEMO_PROFILE_ID = 1
