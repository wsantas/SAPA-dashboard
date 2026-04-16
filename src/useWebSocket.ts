import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { DEMO_MODE } from './api'

export const WsEventSchema = z.object({
  event: z.string(),
  data: z.record(z.string(), z.unknown()),
})

export type WsEvent = z.infer<typeof WsEventSchema>

export type UseWebSocketResult = {
  readonly lastEvent: WsEvent | null
  readonly connected: boolean
}

const MAX_BACKOFF_MS = 30_000

export function useWebSocket(
  url = 'ws://localhost:8002/ws',
): UseWebSocketResult {
  const [lastEvent, setLastEvent] = useState<WsEvent | null>(null)
  const [connected, setConnected] = useState(false)
  const retriesRef = useRef(0)

  useEffect(() => {
    if (DEMO_MODE) return

    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined
    let unmounted = false

    function connect() {
      if (unmounted) return

      ws = new WebSocket(url)

      ws.addEventListener('open', () => {
        if (unmounted) return
        retriesRef.current = 0
        setConnected(true)
      })

      ws.addEventListener('message', (event: MessageEvent<unknown>) => {
        if (unmounted) return
        let raw: unknown
        try {
          raw = JSON.parse(String(event.data))
        } catch {
          return
        }
        const parsed = WsEventSchema.safeParse(raw)
        if (parsed.success) {
          setLastEvent(parsed.data)
        }
      })

      ws.addEventListener('close', () => {
        if (unmounted) return
        setConnected(false)
        scheduleReconnect()
      })

      ws.addEventListener('error', () => {
        // The close event will fire after this, triggering reconnect.
        // Just ensure we mark disconnected.
        if (unmounted) return
        setConnected(false)
      })
    }

    function scheduleReconnect() {
      if (unmounted) return
      const delay = Math.min(
        1000 * Math.pow(2, retriesRef.current),
        MAX_BACKOFF_MS,
      )
      retriesRef.current += 1
      reconnectTimer = setTimeout(connect, delay)
    }

    connect()

    return () => {
      unmounted = true
      clearTimeout(reconnectTimer)
      if (ws) {
        ws.close()
      }
    }
  }, [url])

  if (DEMO_MODE) {
    return { lastEvent: null, connected: false }
  }

  return { lastEvent, connected }
}
