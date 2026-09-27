import { useCallback, useEffect, useState } from 'react'
import { createThread, deleteThread, listThreads, updateThread } from '../db/threadsRepo'
import { getActiveThreadId, setActiveThreadId } from '../lib/storage'
import type { Thread } from '../types/thread'

export function useThreads(defaults: { defaultModel: string; defaultSystemPrompt: string }) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadIdState] = useState<string | null>(() =>
    getActiveThreadId(),
  )
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const list = await listThreads()
    setThreads(list)
    return list
  }, [])

  useEffect(() => {
    void (async () => {
      const list = await refresh()
      const stored = getActiveThreadId()
      if (stored && list.some((t) => t.id === stored)) {
        setActiveThreadIdState(stored)
      } else if (list.length > 0) {
        setActiveThreadIdState(list[0].id)
      }
      setLoading(false)
    })()
  }, [refresh])

  const selectThread = useCallback((id: string | null) => {
    setActiveThreadIdState(id)
    setActiveThreadId(id)
  }, [])

  const addThread = useCallback(async () => {
    const thread = await createThread({
      title: 'New chat',
      systemPrompt: defaults.defaultSystemPrompt,
      model: defaults.defaultModel,
    })
    await refresh()
    selectThread(thread.id)
    return thread
  }, [defaults.defaultModel, defaults.defaultSystemPrompt, refresh, selectThread])

  const renameThread = useCallback(
    async (id: string, title: string) => {
      await updateThread(id, { title })
      await refresh()
    },
    [refresh],
  )

  const updateThreadConfig = useCallback(
    async (id: string, patch: Partial<Pick<Thread, 'systemPrompt' | 'model'>>) => {
      await updateThread(id, patch)
      await refresh()
    },
    [refresh],
  )

  const removeThread = useCallback(
    async (id: string) => {
      await deleteThread(id)
      const list = await refresh()
      if (activeThreadId === id) {
        selectThread(list.length > 0 ? list[0].id : null)
      }
    },
    [activeThreadId, refresh, selectThread],
  )

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null

  return {
    threads,
    activeThread,
    activeThreadId,
    loading,
    selectThread,
    addThread,
    renameThread,
    updateThreadConfig,
    removeThread,
    refresh,
  }
}
