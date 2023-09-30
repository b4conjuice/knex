/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

export default function useLocalStorage<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState<T | undefined>()

  const setValue = (value: T) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  useEffect(() => {
    const value = window.localStorage.getItem(key)

    if (value !== null) {
      try {
        const parsed = JSON.parse(value) as T
        setStoredValue(parsed)
      } catch (error) {
        console.log(error)
        setStoredValue(initialValue)
      }
    } else {
      setStoredValue(initialValue)
    }
  }, [])

  useEffect(() => {
    if (storedValue !== undefined) {
      setValue(storedValue)
    }
  }, [storedValue])

  return [storedValue as T, setStoredValue] as const
}