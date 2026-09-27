import type { OpenRouterModel } from '../types/openrouter'

const KEYS = {
  apiKey: 'llmworkbench:apiKey',
  modelsCache: 'llmworkbench:models:cache',
  modelsFetchedAt: 'llmworkbench:models:fetchedAt',
  defaultModel: 'llmworkbench:settings:defaultModel',
  defaultSystemPrompt: 'llmworkbench:settings:defaultSystemPrompt',
  activeThreadId: 'llmworkbench:settings:activeThreadId',
} as const

export const FALLBACK_DEFAULT_MODEL = 'openai/gpt-4o-mini'
export const FALLBACK_DEFAULT_SYSTEM_PROMPT = 'You are a helpful assistant.'

export function getApiKey(): string | null {
  return localStorage.getItem(KEYS.apiKey)
}

export function setApiKey(key: string): void {
  localStorage.setItem(KEYS.apiKey, key)
}

export function clearApiKey(): void {
  localStorage.removeItem(KEYS.apiKey)
}

export function getModelsCache(): OpenRouterModel[] | null {
  const raw = localStorage.getItem(KEYS.modelsCache)
  if (!raw) return null
  try {
    return JSON.parse(raw) as OpenRouterModel[]
  } catch {
    return null
  }
}

export function setModelsCache(models: OpenRouterModel[]): void {
  localStorage.setItem(KEYS.modelsCache, JSON.stringify(models))
  localStorage.setItem(KEYS.modelsFetchedAt, new Date().toISOString())
}

export function getModelsFetchedAt(): string | null {
  return localStorage.getItem(KEYS.modelsFetchedAt)
}

export function getDefaultModel(): string {
  return localStorage.getItem(KEYS.defaultModel) ?? FALLBACK_DEFAULT_MODEL
}

export function setDefaultModel(model: string): void {
  localStorage.setItem(KEYS.defaultModel, model)
}

export function getDefaultSystemPrompt(): string {
  return localStorage.getItem(KEYS.defaultSystemPrompt) ?? FALLBACK_DEFAULT_SYSTEM_PROMPT
}

export function setDefaultSystemPrompt(prompt: string): void {
  localStorage.setItem(KEYS.defaultSystemPrompt, prompt)
}

export function getActiveThreadId(): string | null {
  return localStorage.getItem(KEYS.activeThreadId)
}

export function setActiveThreadId(id: string | null): void {
  if (id === null) {
    localStorage.removeItem(KEYS.activeThreadId)
  } else {
    localStorage.setItem(KEYS.activeThreadId, id)
  }
}
