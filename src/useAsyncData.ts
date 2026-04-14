import { useCallback, useEffect, useState } from 'react'
import type { AsyncState } from './types'

export type UseAsyncDataResult<T> = {
  state: AsyncState<T>
  refetch: () => void
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
): UseAsyncDataResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      })

    return () => {
      cancelled = true
    }
  }, [fetcher, version])

  const refetch = useCallback(() => {
    setState({ status: 'loading' })
    setVersion((v) => v + 1)
  }, [])

  return { state, refetch }
}
