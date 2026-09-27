import { generateId } from '../lib/idGen'
import type { Thread } from '../types/thread'
import { getDb } from './client'
import { INDEX_THREADS_BY_UPDATED_AT, STORE_MESSAGES, STORE_THREADS } from './schema'

export async function listThreads(): Promise<Thread[]> {
  const db = await getDb()
  const threads = await db.getAllFromIndex(STORE_THREADS, INDEX_THREADS_BY_UPDATED_AT)
  return threads.reverse()
}

export async function getThread(id: string): Promise<Thread | undefined> {
  const db = await getDb()
  return db.get(STORE_THREADS, id)
}

export async function createThread(input: {
  title: string
  systemPrompt: string
  model: string
}): Promise<Thread> {
  const db = await getDb()
  const now = new Date().toISOString()
  const thread: Thread = {
    id: generateId(),
    title: input.title,
    systemPrompt: input.systemPrompt,
    model: input.model,
    createdAt: now,
    updatedAt: now,
  }
  await db.put(STORE_THREADS, thread)
  return thread
}

export async function updateThread(
  id: string,
  patch: Partial<Pick<Thread, 'title' | 'systemPrompt' | 'model'>>,
): Promise<Thread | undefined> {
  const db = await getDb()
  const existing = await db.get(STORE_THREADS, id)
  if (!existing) return undefined
  const updated: Thread = { ...existing, ...patch, updatedAt: new Date().toISOString() }
  await db.put(STORE_THREADS, updated)
  return updated
}

export async function deleteThread(id: string): Promise<void> {
  const db = await getDb()
  const tx = db.transaction([STORE_THREADS, STORE_MESSAGES], 'readwrite')
  await tx.objectStore(STORE_THREADS).delete(id)
  const messageIndex = tx.objectStore(STORE_MESSAGES).index('by-threadId')
  let cursor = await messageIndex.openCursor(id)
  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }
  await tx.done
}
