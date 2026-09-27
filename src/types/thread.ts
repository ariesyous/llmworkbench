export interface Thread {
  id: string
  title: string
  systemPrompt: string
  model: string
  createdAt: string
  updatedAt: string
}

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  threadId: string
  role: MessageRole
  content: string
  createdAt: string
  model?: string
  error?: string
}
