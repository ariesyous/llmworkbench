import {
  OpenRouterApiError,
  type ChatCompletionChunk,
  type ChatMessageInput,
  type OpenRouterErrorBody,
  type OpenRouterModel,
} from '../types/openrouter'
import { parseSSEStream } from './sse'

const API_BASE = 'https://openrouter.ai/api/v1'

export async function fetchModels(apiKey?: string): Promise<OpenRouterModel[]> {
  const headers: Record<string, string> = {}
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const res = await fetch(`${API_BASE}/models`, { headers })
  if (!res.ok) {
    throw new OpenRouterApiError(res.status, `Failed to fetch models (${res.status})`)
  }
  const body = (await res.json()) as { data: OpenRouterModel[] }
  return body.data
}

export interface StreamChatCompletionInput {
  apiKey: string
  model: string
  messages: ChatMessageInput[]
  signal?: AbortSignal
  onToken: (token: string) => void
  onModel?: (model: string) => void
}

export async function streamChatCompletion({
  apiKey,
  model,
  messages,
  signal,
  onToken,
  onModel,
}: StreamChatCompletionInput): Promise<void> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, stream: true }),
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return
    throw err
  }

  if (!res.ok) {
    let message = `OpenRouter request failed (${res.status})`
    try {
      const errorBody = (await res.json()) as OpenRouterErrorBody
      if (errorBody.error?.message) message = errorBody.error.message
    } catch {
      // response body wasn't JSON; keep the default message
    }
    throw new OpenRouterApiError(res.status, message)
  }

  let reportedModel = false
  try {
    await parseSSEStream(res, (data) => {
      if (data === '[DONE]') return
      let chunk: ChatCompletionChunk
      try {
        chunk = JSON.parse(data) as ChatCompletionChunk
      } catch {
        return
      }
      if (!reportedModel && chunk.model) {
        reportedModel = true
        onModel?.(chunk.model)
      }
      const content = chunk.choices?.[0]?.delta?.content
      if (content) onToken(content)
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return
    throw err
  }
}
