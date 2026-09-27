import { useCallback, useState } from 'react'
import { clearApiKey, getApiKey, setApiKey } from '../lib/storage'

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(() => getApiKey())

  const saveApiKey = useCallback((key: string) => {
    setApiKey(key)
    setApiKeyState(key)
  }, [])

  const removeApiKey = useCallback(() => {
    clearApiKey()
    setApiKeyState(null)
  }, [])

  return {
    apiKey,
    hasApiKey: apiKey !== null && apiKey !== '',
    saveApiKey,
    removeApiKey,
  }
}
