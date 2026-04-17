import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

// Mock the api module so DEMO_MODE is true for these tests — that
// short-circuits the useWebSocket effect so it never actually tries
// to open a connection in the test env.
vi.mock('./api', () => ({
  DEMO_MODE: true,
  setActiveProfileId: () => {},
}))

describe('useWebSocket (DEMO_MODE path)', () => {
  it('returns { lastEvent: null, connected: false } without attempting a connection', async () => {
    const { useWebSocket } = await import('./useWebSocket')
    const { result } = renderHook(() => useWebSocket())
    expect(result.current.lastEvent).toBeNull()
    expect(result.current.connected).toBe(false)
  })
})

describe('WsEventSchema', () => {
  it('parses SAPAs { event, data } message shape', async () => {
    const { WsEventSchema } = await import('./useWebSocket')
    const msg = {
      event: 'file_created',
      data: {
        path: '/home/bill/inbox/note.md',
        timestamp: '2026-04-17T14:30:00Z',
      },
    }
    const parsed = WsEventSchema.safeParse(msg)
    expect(parsed.success).toBe(true)
  })

  it('accepts the "connected" handshake message', async () => {
    const { WsEventSchema } = await import('./useWebSocket')
    const msg = {
      event: 'connected',
      data: { files_count: 4, watch_path: '/inbox' },
    }
    expect(WsEventSchema.safeParse(msg).success).toBe(true)
  })

  it('rejects messages missing the event field', async () => {
    const { WsEventSchema } = await import('./useWebSocket')
    const bad = { data: { path: '/inbox/x.md' } }
    expect(WsEventSchema.safeParse(bad).success).toBe(false)
  })

  it('rejects messages with a non-object data field', async () => {
    const { WsEventSchema } = await import('./useWebSocket')
    const bad = { event: 'file_created', data: 'not-an-object' }
    expect(WsEventSchema.safeParse(bad).success).toBe(false)
  })
})
