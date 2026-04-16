import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'

const POSTHOG_KEY = import.meta.env['VITE_POSTHOG_KEY']
const POSTHOG_HOST =
  import.meta.env['VITE_POSTHOG_HOST'] ?? 'https://us.i.posthog.com'

// Only init in production builds so `npm run dev` on localhost never
// mixes dev activity into the PostHog project's analytics. Vercel ships
// a production build so the deployed demo still tracks normally.
if (POSTHOG_KEY && import.meta.env.PROD) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: true,
    capture_pageview: true,
    session_recording: { maskAllInputs: false },
    disable_session_recording: false,
    person_profiles: 'identified_only',
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
