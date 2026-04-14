# SAPA Dashboard

**Live demo:** https://sapa-dashboard.vercel.app

A real-time analytics dashboard for [SAPA](https://github.com/wsantas/sapa-public), a local FastAPI spaced-repetition tracker. Built as a 0→1 TypeScript + React learning project against a real backend I already owned.

> The Vercel deployment runs in demo mode with a baked snapshot of real SAPA analytics and a real Claude-generated insights response — the frontend code path is identical, just short-circuited before the network call so there's no need to expose a local backend. Clone the repo and run it against your own SAPA instance (see below) to see it hit the live API.

The point was to build a production-quality TS + React frontend in a few focused sessions, hitting every major pattern Ashby-class and PostHog-class codebases care about, while shipping something I actually use.

## What it does

- Pulls a rich analytics payload from SAPA's `/api/analytics` endpoint and renders it as four dashboard widgets
- Validates the payload at runtime with Zod so network-shape drift surfaces immediately rather than crashing three renders later
- Surfaces a custom "AI Insights" widget that POSTs the current learning state to `/api/ai/insights` on the backend, which in turn calls Claude Sonnet 4.5 with a coaching system prompt and returns 2–3 personalized, actionable suggestions
- Handles loading, error, and retry states cleanly across every async surface, powered by a single generic `useAsyncData<T>` hook and a discriminated-union `AsyncState<T>` type

## Stack

| Layer | Choice | Why |
|---|---|---|
| Bundler | Vite 8 | Fast, ESM-native, Vitest uses the same transform |
| Runtime | React 19 | Latest stable, auto JSX transform, automatic batching |
| Language | TypeScript in `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `verbatimModuleSyntax` | Senior-grade strictness from day one, not bolted on later |
| Runtime validation | Zod v4 with `z.infer` for type derivation | Single source of truth: schemas drive types |
| Data fetching | Hand-rolled generic `apiGet<T>` / `apiPost<T>` with schema-constrained generics | No React Query until the use case justifies it (YAGNI) |
| Styling | CSS Modules + CSS custom properties | Scoped, type-friendly, zero runtime cost |
| Tests | Vitest + typed-as-`unknown` fixtures | Pure schema assertions, no JSDOM overhead until needed |
| Backend | [SAPA](https://github.com/wsantas/sapa-public) — FastAPI, SQLite, watchdog, Anthropic Python SDK | Already built; this project talks to it |

## Architecture in one diagram

```
┌──────────────────────────┐         ┌──────────────────────────┐
│  sapa-dashboard (this)   │         │  sapa-public (FastAPI)   │
│                          │         │                          │
│   App.tsx                │         │   /api/analytics         │
│   └─ useAsyncData<T>     │◀──────▶ │   /api/ai/insights ──────┼──▶ Claude
│      └─ apiGet<T>        │  HTTP   │                          │
│         └─ zod parse     │         │   SQLite + watchdog       │
│                          │         │   spaced-repetition core  │
│   ┌──────────────────┐   │         │                          │
│   │ StreakCard       │   │         │                          │
│   │ ConfidenceBars   │   │         │                          │
│   │ DueReviewsList   │   │         │                          │
│   │ InsightsCard ────┼───┘         └──────────────────────────┘
│   └──────────────────┘
└──────────────────────────┘
```

## TypeScript patterns worth reading

If you're evaluating this code, these are the bits I'd point at first:

- **Discriminated union for async state**  (`src/types.ts` + `src/useAsyncData.ts`) — `AsyncState<T>` is a four-variant union with a `status` discriminant. Every switch in `App.tsx` and `InsightsCard.tsx` uses exhaustiveness checking via `const _exhaustive: never = state` in the default branch. Adding a fifth variant would cause a compile error at every incomplete switch.
- **Schema-first types** (`src/types.ts`) — `z.infer<typeof AnalyticsSchema>` derives the TS type from the zod schema. There is no way to drift the type and the validator. Rename a field, everything updates.
- **Generic typed API client**  (`src/api.ts`) — `apiGet<T>(path, schema: z.ZodType<T>)` uses `z.ZodType<T>` as the constraint so a call site like `apiGet('/api/analytics', AnalyticsSchema)` infers `Promise<Analytics>` with zero explicit type arguments. Same for `apiPost<T>`. Adding a new endpoint is one line.
- **Generic custom hook** (`src/useAsyncData.ts`) — `useAsyncData<T>(fetcher: () => Promise<T>)` returns `{ state: AsyncState<T>, refetch }`. `refetch` is memoized with `useCallback([])`, uses a `version` counter and a cancellation flag to prevent stale state updates on unmount or race. Sets loading state in the event handler rather than inside the effect to avoid the `react-hooks/set-state-in-effect` smell.
- **Zod at the boundary, cast-free** (`src/api.ts`) — every network response goes through `schema.safeParse()` with `z.prettifyError()` error messages. No `as T` casts. Runtime-invalid responses surface as readable errors in the UI's error state.
- **`Record<keyof T, V>` label maps** (`src/components/ConfidenceBreakdown.tsx`) — links UI labels to schema keys at compile time. Add a new confidence bucket and TS forces you to add its label.
- **`readonly T[]` prop contracts** (`src/components/DueReviewsList.tsx`) — widgets can't mutate their inputs. TS strips `push`/`sort`/etc. at the type level.
- **Module-scope `Intl.DateTimeFormat`** (`src/components/DueReviewsList.tsx`) — expensive locale-aware formatters created once, not on every render.

## Running locally

You'll need SAPA running on port 8002 (see [sapa-public](https://github.com/wsantas/sapa-public) — CORS is pre-configured for `localhost:5173`).

```bash
# Start SAPA backend in one terminal
cd ~/dev/sapa-public
PYTHONPATH=. .venv/bin/python -m sapa.app --port 8002

# Start the dashboard in another
cd ~/dev/sapa-dashboard
npm install
npm run dev
```

Open http://localhost:5173.

For the AI Insights widget, SAPA needs a valid `ANTHROPIC_API_KEY` in its env (either `export` or `~/dev/sapa-public/.env` — python-dotenv is installed).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build (typecheck + bundle) |
| `npm run typecheck` | `tsc --noEmit` — types only, no bundle |
| `npm run lint` | ESLint — TS-aware, react-hooks rules |
| `npm test` | Vitest in watch mode |
| `npm test -- --run` | Vitest one-shot (for CI) |

## Project structure

```
src/
├── api.ts                           # apiGet/apiPost + fetchAnalytics/fetchInsights
├── types.ts                         # zod schemas + z.infer types + AsyncState<T>
├── useAsyncData.ts                  # generic fetch hook with refetch
├── App.tsx                          # top-level composition + switch
├── App.module.css                   # app shell, header, grid, loading states
├── index.css                        # design tokens + global resets
├── main.tsx                         # React 19 createRoot entry
├── components/
│   ├── StreakCard.tsx               # stat grid for Overview
│   ├── ConfidenceBreakdown.tsx      # animated bars for ConfidenceDistribution
│   ├── DueReviewsList.tsx           # typed readonly list with empty state
│   ├── InsightsCard.tsx             # AI Insights widget (self-managed state)
│   └── Card.module.css              # shared card chrome
├── types.test.ts                    # 6 zod schema assertions
└── __fixtures__/
    └── analytics.ts                 # typed-as-unknown fixture variants
```

## What's deliberately not here (YAGNI)

I kept the scope tight. Things I considered and declined until there's a concrete need:

- **No React Query / SWR** — one generic hook covers every call site so far
- **No state management library** — the only cross-component state is the analytics response, and it lives in `App`
- **No react-router** — single view; we'll add routing the moment we add a second
- **No component snapshot tests** — behavior-based tests if/when needed, never snapshots
- **No barrel `index.ts` files** — they complicate tree-shaking and don't help readability at this scale
- **No CSS-in-JS runtime** — plain CSS Modules are cheaper, faster, and the TS story is fine
- **No env-var URL / proxy** — the base URL is a single constant; we'll move it when we actually deploy

## License

MIT, same as SAPA.
