import { useCallback, useState } from 'react'
import {
  getDefaultModel,
  getDefaultSystemPrompt,
  setDefaultModel,
  setDefaultSystemPrompt,
} from '../lib/storage'

export function useSettings() {
  const [defaultModel, setDefaultModelState] = useState(() => getDefaultModel())
  const [defaultSystemPrompt, setDefaultSystemPromptState] = useState(() =>
    getDefaultSystemPrompt(),
  )

  const updateDefaultModel = useCallback((model: string) => {
    setDefaultModel(model)
    setDefaultModelState(model)
  }, [])

  const updateDefaultSystemPrompt = useCallback((prompt: string) => {
    setDefaultSystemPrompt(prompt)
    setDefaultSystemPromptState(prompt)
  }, [])

  return {
    defaultModel,
    defaultSystemPrompt,
    updateDefaultModel,
    updateDefaultSystemPrompt,
  }
}
