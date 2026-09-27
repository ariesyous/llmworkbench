import { createContext, useContext, type ReactNode } from 'react'
import { useApiKey } from '../hooks/useApiKey'
import { useModels } from '../hooks/useModels'
import { useSettings } from '../hooks/useSettings'
import { useThreads } from '../hooks/useThreads'

type ApiKeyState = ReturnType<typeof useApiKey>
type SettingsState = ReturnType<typeof useSettings>
type ModelsState = ReturnType<typeof useModels>
type ThreadsState = ReturnType<typeof useThreads>

interface AppContextValue {
  apiKeyState: ApiKeyState
  settingsState: SettingsState
  modelsState: ModelsState
  threadsState: ThreadsState
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProviders({ children }: { children: ReactNode }) {
  const apiKeyState = useApiKey()
  const settingsState = useSettings()
  const modelsState = useModels(apiKeyState.apiKey)
  const threadsState = useThreads({
    defaultModel: settingsState.defaultModel,
    defaultSystemPrompt: settingsState.defaultSystemPrompt,
  })

  return (
    <AppContext.Provider value={{ apiKeyState, settingsState, modelsState, threadsState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProviders')
  return ctx
}
