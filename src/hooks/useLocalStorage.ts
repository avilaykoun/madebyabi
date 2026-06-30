import { useCallback, useEffect, useState } from 'react'

/**
 * useState that persists to localStorage under the given key. Safely handles
 * environments without localStorage and malformed stored values.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const [value, setValue] = useState<T>(readValue)

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be full or unavailable (private mode) — ignore.
    }
  }, [key, value])

  return [value, setValue] as const
}
