import type {
  Analytics,
  DashboardSignals,
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

// Helper to keep the history fixtures readable. Each entry is a small
// session record on a specific date; the detail panel shows topic +
// session_type + time, so prompt/response are short placeholders.
let _nextHistoryId = 1
function mkHistory(
  date: string,
  time: string,
  sessionType: string,
  topic: string,
): HistoryEntry {
  return {
    id: _nextHistoryId++,
    session_type: sessionType,
    topic,
    prompt: `${topic} — session content.`,
    response: `${topic} — expanded response content.`,
    notes: null,
    created_at: `${date}T${time}.000000`,
  }
}

export const demoHistory: HistoryEntry[] = [
  // One or more sessions per day with activity in demoAnalytics.daily_activity.
  // Session count per day is realistic (1–3), not matching the topic count —
  // one dense .md file can produce many extracted topics.
  mkHistory('2026-01-20', '09:15:00', 'session', 'Cold Therapy for Recovery'),
  mkHistory('2026-01-20', '14:30:00', 'session', 'Heart Rate Variability Basics'),
  mkHistory('2026-01-27', '10:00:00', 'session', 'Sleep Architecture and Stages'),
  mkHistory('2026-02-03', '08:45:00', 'session', 'Zone 2 Cardio Protocols'),
  mkHistory('2026-02-03', '13:20:00', 'session', 'Breathwork Fundamentals'),
  mkHistory('2026-02-03', '17:00:00', 'session', 'Nutrition Timing for Performance'),
  mkHistory('2026-02-08', '10:30:00', 'session', 'Foam Rolling Techniques'),
  mkHistory('2026-02-14', '09:00:00', 'session', 'Active Recovery Methods'),
  mkHistory('2026-02-14', '15:45:00', 'session', 'Ice Bath Protocol Guide'),
  mkHistory('2026-02-21', '08:15:00', 'session', 'HIIT Training Methodology'),
  mkHistory('2026-02-21', '14:00:00', 'session', 'Contrast Therapy Research'),
  mkHistory('2026-03-01', '09:30:00', 'session', 'Barbell Strength Training'),
  mkHistory('2026-03-01', '16:00:00', 'session', 'Progressive Overload Principles'),
  mkHistory('2026-03-03', '08:00:00', 'session', 'Hypertrophy vs Strength'),
  mkHistory('2026-03-03', '14:30:00', 'session', 'Deadlift Form Deep Dive'),
  mkHistory('2026-03-08', '10:15:00', 'session', 'Squat Mobility Requirements'),
  mkHistory('2026-03-10', '09:00:00', 'session', 'Overhead Press Mechanics'),
  mkHistory('2026-03-10', '13:45:00', 'session', 'Power Clean Technique'),
  mkHistory('2026-03-14', '08:30:00', 'session', 'Mobility Work for Lifters'),
  mkHistory('2026-03-14', '15:00:00', 'session', 'Pre-workout Activation'),
  mkHistory('2026-03-15', '10:00:00', 'session', 'Post-workout Cooldown'),
  mkHistory('2026-03-19', '09:15:00', 'session', 'Periodization Basics'),
  mkHistory('2026-03-19', '14:20:00', 'protocol', 'Building Morning Protocols'),
  mkHistory('2026-03-22', '08:45:00', 'session', 'Deload Week Programming'),
  mkHistory('2026-03-25', '10:30:00', 'session', 'RPE-based Training'),
  mkHistory('2026-03-25', '16:00:00', 'session', 'Training Frequency Research'),
  mkHistory('2026-03-28', '09:00:00', 'session', 'Volume Landmarks Explained'),
  mkHistory('2026-03-28', '13:30:00', 'protocol', 'Pre-Workout Protocol'),
  mkHistory('2026-03-29', '10:45:00', 'session', 'Supplementation for Strength'),
  mkHistory('2026-03-31', '08:15:00', 'session', 'Cold Therapy Deep Dive'),
  mkHistory('2026-03-31', '14:00:00', 'protocol', 'Recovery Protocol Design'),
  mkHistory('2026-04-01', '09:30:00', 'session', 'Sleep Hygiene Checklist'),
  mkHistory('2026-04-03', '08:00:00', 'session', 'Meal Prep for Training Days'),
  mkHistory('2026-04-03', '15:30:00', 'session', 'Hydration Strategies'),
  mkHistory('2026-04-05', '10:00:00', 'session', 'Morning Routine Optimization'),
  mkHistory('2026-04-06', '09:15:00', 'session', 'Evening Wind-Down Routine'),
  mkHistory('2026-04-06', '14:45:00', 'protocol', 'Pre-Sleep Protocol'),
  mkHistory('2026-04-07', '08:30:00', 'session', 'Caffeine and Performance'),
  mkHistory('2026-04-07', '13:00:00', 'session', 'Circadian Rhythm Basics'),
  mkHistory('2026-04-07', '17:30:00', 'session', 'Recovery Nutrition'),
  mkHistory('2026-04-09', '10:30:00', 'session', 'Breathing for Athletes'),
  mkHistory('2026-04-10', '09:00:00', 'session', 'Lean Weight Gain Protocol'),
  mkHistory('2026-04-10', '15:15:00', 'session', 'Cold Therapy Follow-Up'),
  mkHistory('2026-04-12', '08:45:00', 'session', 'Barbell Strength — Week 8'),
  mkHistory('2026-04-12', '14:00:00', 'protocol', 'Training Block Structure'),
  mkHistory('2026-04-13', '16:16:33', 'session', 'Cold Therapy for Recovery — Elite Deep Dive'),
  mkHistory('2026-04-13', '17:43:20', 'session', 'Lean Weight Gain Protocol for Hardgainers'),
  mkHistory('2026-04-14', '14:30:00', 'session', 'Barbell Strength Training — Elite Deep Dive'),
  mkHistory('2026-04-14', '15:00:00', 'protocol', 'Morning Routines, Pre-Workout, Recovery, and Sleep'),
]

// Reset id counter between profiles so ids don't collide across fixtures.
_nextHistoryId = 1

export const demoHistoryJane: HistoryEntry[] = [
  mkHistory('2026-02-10', '10:15:00', 'session', 'Sourdough Starter Creation'),
  mkHistory('2026-02-14', '09:30:00', 'session', 'Companion Planting Guide'),
  mkHistory('2026-02-14', '14:00:00', 'session', 'Seed Catalog Selection'),
  mkHistory('2026-02-22', '11:00:00', 'session', 'Soil Amendment Basics'),
  mkHistory('2026-03-01', '08:30:00', 'session', 'Raised Bed Garden Planning'),
  mkHistory('2026-03-01', '13:45:00', 'session', 'Composting Systems'),
  mkHistory('2026-03-05', '09:00:00', 'session', 'Seed Starting Indoors'),
  mkHistory('2026-03-05', '15:30:00', 'session', 'Grow Light Setup'),
  mkHistory('2026-03-08', '10:00:00', 'session', 'Fermentation Basics'),
  mkHistory('2026-03-08', '14:15:00', 'session', 'Lacto-Fermentation Techniques'),
  mkHistory('2026-03-12', '09:45:00', 'session', 'Mulching Techniques'),
  mkHistory('2026-03-15', '08:00:00', 'session', 'Crop Rotation Plans'),
  mkHistory('2026-03-15', '11:30:00', 'session', 'No-Till Gardening'),
  mkHistory('2026-03-15', '16:00:00', 'protocol', 'Weekly Garden Maintenance'),
  mkHistory('2026-03-20', '09:15:00', 'session', 'Canning Basics'),
  mkHistory('2026-03-20', '14:30:00', 'session', 'Water Bath Canning'),
  mkHistory('2026-03-25', '10:00:00', 'session', 'Pickling Cucumbers'),
  mkHistory('2026-03-28', '08:45:00', 'session', 'Pressure Canning Safety'),
  mkHistory('2026-03-28', '13:20:00', 'session', 'Dehydrating Vegetables'),
  mkHistory('2026-03-28', '17:00:00', 'session', 'Root Cellar Setup'),
  mkHistory('2026-04-01', '09:30:00', 'session', 'Bread Baking Techniques'),
  mkHistory('2026-04-03', '08:00:00', 'session', 'Pie Crust from Scratch'),
  mkHistory('2026-04-03', '14:00:00', 'session', 'Herb Garden Design'),
  mkHistory('2026-04-06', '10:30:00', 'session', 'Drip Irrigation Setup'),
  mkHistory('2026-04-08', '09:00:00', 'session', 'Chicken Coop Design Basics'),
  mkHistory('2026-04-08', '14:45:00', 'session', 'Flock Management 101'),
  mkHistory('2026-04-09', '11:00:00', 'session', 'Beekeeping Fundamentals'),
  mkHistory('2026-04-10', '10:15:00', 'session', 'Water Filtration Systems'),
  mkHistory('2026-04-10', '15:00:00', 'session', 'Rainwater Harvesting'),
  mkHistory('2026-04-11', '09:45:00', 'session', 'Kombucha Brewing'),
  mkHistory('2026-04-12', '10:30:00', 'session', 'Yogurt Making'),
  mkHistory('2026-04-12', '14:00:00', 'session', 'Sprouting for Nutrition'),
  mkHistory('2026-04-13', '08:45:00', 'session', 'Raised Bed Garden Planning for Zone 7'),
  mkHistory('2026-04-13', '14:00:00', 'session', 'Backyard Chicken Coop Design and Flock Management'),
  mkHistory('2026-04-14', '10:00:00', 'session', 'Vermiculture Basics'),
  mkHistory('2026-04-14', '15:30:00', 'session', 'Sourdough Starter Maintenance'),
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

// Baked PostHog signals for demo mode — shown to recruiters on the
// deployed URL. Numbers are plausible for a new project with low
// volume; updated periodically to keep the demo feeling live.
export const demoSignals: DashboardSignals = {
  weeklySessions: 14,
  topEvents: [
    { event: 'heatmap_day_clicked', count: 47 },
    { event: 'topic_expanded', count: 31 },
    { event: 'profile_switched', count: 18 },
    { event: 'insights_generated', count: 9 },
    { event: 'refresh_clicked', count: 6 },
  ],
  lastActivityTs: Math.floor(Date.now() / 1000) - 87,
}
