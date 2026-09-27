export interface OpenRouterModel {
  id: string
  name: string
  description?: string
  context_length?: number
  pricing?: {
    prompt?: string
    completion?: string
  }
}

export interface ChatCompletionDelta {
  role?: string
  content?: string
}

export interface ChatCompletionChunkChoice {
  delta: ChatCompletionDelta
  finish_reason?: string | null
}

export interface ChatCompletionChunk {
  id?: string
  model?: string
  choices: ChatCompletionChunkChoice[]
}

export interface OpenRouterErrorBody {
  error?: {
    message?: string
    code?: string | number
  }
}

export class OpenRouterApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'OpenRouterApiError'
    this.status = status
  }
}

export interface ChatMessageInput {
  role: MessageRoleForApi
  content: string
}

export type MessageRoleForApi = 'user' | 'assistant' | 'system'
