import { generateId } from '../lib/idGen'
import type { Message, MessageRole } from '../types/thread'
import { getDb } from './client'
import { INDEX_MESSAGES_BY_THREAD_ID, STORE_MESSAGES } from './schema'

export async function getMessagesByThread(threadId: string): Promise<Message[]> {
  const db = await getDb()
  const messages = await db.getAllFromIndex(STORE_MESSAGES, INDEX_MESSAGES_BY_THREAD_ID, threadId)
  return messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function addMessage(input: {
  threadId: string
  role: MessageRole
  content: string
  model?: string
}): Promise<Message> {
  const db = await getDb()
  const message: Message = {
    id: generateId(),
    threadId: input.threadId,
    role: input.role,
    content: input.content,
    createdAt: new Date().toISOString(),
    model: input.model,
  }
  await db.put(STORE_MESSAGES, message)
  return message
}

export async function updateMessage(
  id: string,
  patch: Partial<Pick<Message, 'content' | 'error' | 'model'>>,
): Promise<void> {
  const db = await getDb()
  const existing = await db.get(STORE_MESSAGES, id)
  if (!existing) return
  await db.put(STORE_MESSAGES, { ...existing, ...patch })
}

export async function deleteMessagesByThread(threadId: string): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(STORE_MESSAGES, 'readwrite')
  const index = tx.store.index('by-threadId')
  let cursor = await index.openCursor(threadId)
  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }
  await tx.done
}
