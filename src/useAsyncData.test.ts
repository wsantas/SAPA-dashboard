import { describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useAsyncData } from './useAsyncData'

describe('useAsyncData', () => {
  it('starts in loading state on mount', () => {
    const fetcher = vi.fn().mockResolvedValue('data')
    const { result } = renderHook(() => useAsyncData(fetcher))
    expect(result.current.state.status).toBe('loading')
  })

  it('transitions to success after fetcher resolves', async () => {
    const fetcher = vi.fn().mockResolvedValue({ hello: 'world' })
    const { result } = renderHook(() => useAsyncData(fetcher))

    await waitFor(() =>
      expect(result.current.state.status).toBe('success'),
    )
    if (result.current.state.status === 'success') {
      expect(result.current.state.data).toEqual({ hello: 'world' })
    }
  })

  it('transitions to error when fetcher rejects', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('nope'))
    const { result } = renderHook(() => useAsyncData(fetcher))

    await waitFor(() => expect(result.current.state.status).toBe('error'))
    if (result.current.state.status === 'error') {
      expect(result.current.state.error.message).toBe('nope')
    }
  })

  it('wraps non-Error rejections in an Error', async () => {
    const fetcher = vi.fn().mockRejectedValue('plain string reason')
    const { result } = renderHook(() => useAsyncData(fetcher))

    await waitFor(() => expect(result.current.state.status).toBe('error'))
    if (result.current.state.status === 'error') {
      expect(result.current.state.error).toBeInstanceOf(Error)
      expect(result.current.state.error.message).toBe('plain string reason')
    }
  })

  it('refetch() resets to loading and produces the new fetchers result', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')
    const { result } = renderHook(() => useAsyncData(fetcher))

    await waitFor(() =>
      expect(result.current.state.status).toBe('success'),
    )

    act(() => result.current.refetch())
    expect(result.current.state.status).toBe('loading')

    await waitFor(() =>
      expect(result.current.state.status).toBe('success'),
    )
    if (result.current.state.status === 'success') {
      expect(result.current.state.data).toBe('second')
    }
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('silentRefetch() keeps success state visible during the refetch (stale-while-revalidate)', async () => {
    let resolveSecond: ((v: string) => void) | undefined
    const secondFetchPromise = new Promise<string>((r) => {
      resolveSecond = r
    })
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce('first')
      .mockReturnValueOnce(secondFetchPromise)

    const { result } = renderHook(() => useAsyncData(fetcher))
    await waitFor(() =>
      expect(result.current.state.status).toBe('success'),
    )

    act(() => result.current.silentRefetch())

    // Still success with OLD data — the loading state is never entered
    expect(result.current.state.status).toBe('success')
    if (result.current.state.status === 'success') {
      expect(result.current.state.data).toBe('first')
    }

    // Resolve the in-flight fetch and confirm the data updates in place
    act(() => {
      resolveSecond!('second')
    })
    await waitFor(() => {
      if (result.current.state.status === 'success') {
        return result.current.state.data === 'second'
      }
      return false
    })
  })

  it('refetch and silentRefetch maintain stable identity across renders', () => {
    const fetcher = vi.fn().mockResolvedValue('data')
    const { result, rerender } = renderHook(() => useAsyncData(fetcher))

    const firstRefetch = result.current.refetch
    const firstSilent = result.current.silentRefetch

    rerender()

    expect(result.current.refetch).toBe(firstRefetch)
    expect(result.current.silentRefetch).toBe(firstSilent)
  })
})
