import { useCallback, useEffect, useReducer } from 'react'
import type { AsyncState } from './types'

export type UseAsyncDataResult<T> = {
  state: AsyncState<T>
  /** Trigger a fetch and reset state to 'loading' so the UI shows a
   *  loading indicator. Use for explicit user-initiated refreshes. */
  refetch: () => void
  /** Trigger a fetch without resetting state. The previous data
   *  remains visible while the new fetch is in flight. Use for polling
   *  or background refreshes where the loading flash would be jarring
   *  (stale-while-revalidate pattern). */
  silentRefetch: () => void
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
): UseAsyncDataResult<T> {
  type State = { async: AsyncState<T>; version: number }
  type Action =
    | { type: 'refetch-requested' }
    | { type: 'silent-refetch-requested' }
    | { type: 'resolved'; data: T }
    | { type: 'rejected'; error: Error }

  const reducer = (prev: State, action: Action): State => {
    switch (action.type) {
      case 'refetch-requested':
        return { async: { status: 'loading' }, version: prev.version + 1 }
      case 'silent-refetch-requested':
        // Don't reset to loading — keep existing data visible while the
        // effect re-fires and fetches fresh data (stale-while-revalidate).
        return { ...prev, version: prev.version + 1 }
      case 'resolved':
        return { ...prev, async: { status: 'success', data: action.data } }
      case 'rejected':
        return { ...prev, async: { status: 'error', error: action.error } }
      default: {
        const _exhaustive: never = action
        return _exhaustive
      }
    }
  }

  const initialState: State = {
    async: { status: 'loading' },
    version: 0,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) dispatch({ type: 'resolved', data })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        dispatch({
          type: 'rejected',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      })

    return () => {
      cancelled = true
    }
  }, [fetcher, state.version])

  const refetch = useCallback(() => {
    dispatch({ type: 'refetch-requested' })
  }, [])

  const silentRefetch = useCallback(() => {
    dispatch({ type: 'silent-refetch-requested' })
  }, [])

  return { state: state.async, refetch, silentRefetch }
}
