import { useCallback, useEffect, useState } from 'react'
import { fetchModels } from '../lib/openrouterClient'
import { getModelsCache, getModelsFetchedAt, setModelsCache } from '../lib/storage'
import type { OpenRouterModel } from '../types/openrouter'

export function useModels(apiKey: string | null) {
  const [models, setModels] = useState<OpenRouterModel[]>(() => getModelsCache() ?? [])
  const [fetchedAt, setFetchedAt] = useState<string | null>(() => getModelsFetchedAt())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fresh = await fetchModels(apiKey ?? undefined)
      fresh.sort((a, b) => a.name.localeCompare(b.name))
      setModelsCache(fresh)
      setModels(fresh)
      setFetchedAt(getModelsFetchedAt())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => {
    if (models.length === 0 && apiKey) {
      void refresh()
    }
    // Only auto-fetch once on first mount when there's nothing cached yet.
  }, [apiKey])

  return { models, fetchedAt, loading, error, refresh }
}
