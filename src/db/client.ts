import { openDB, type IDBPDatabase } from 'idb'
import type { Message, Thread } from '../types/thread'
import {
  DB_NAME,
  DB_VERSION,
  INDEX_MESSAGES_BY_THREAD_ID,
  INDEX_MESSAGES_BY_THREAD_ID_CREATED_AT,
  INDEX_THREADS_BY_UPDATED_AT,
  STORE_MESSAGES,
  STORE_THREADS,
} from './schema'

export interface LlmWorkbenchDB {
  [STORE_THREADS]: {
    key: string
    value: Thread
    indexes: { [INDEX_THREADS_BY_UPDATED_AT]: string }
  }
  [STORE_MESSAGES]: {
    key: string
    value: Message
    indexes: {
      [INDEX_MESSAGES_BY_THREAD_ID]: string
      [INDEX_MESSAGES_BY_THREAD_ID_CREATED_AT]: [string, string]
    }
  }
}

let dbPromise: Promise<IDBPDatabase<LlmWorkbenchDB>> | null = null

export function getDb(): Promise<IDBPDatabase<LlmWorkbenchDB>> {
  if (!dbPromise) {
    dbPromise = openDB<LlmWorkbenchDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_THREADS)) {
          const threads = db.createObjectStore(STORE_THREADS, { keyPath: 'id' })
          threads.createIndex(INDEX_THREADS_BY_UPDATED_AT, 'updatedAt')
        }
        if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
          const messages = db.createObjectStore(STORE_MESSAGES, { keyPath: 'id' })
          messages.createIndex(INDEX_MESSAGES_BY_THREAD_ID, 'threadId')
          messages.createIndex(INDEX_MESSAGES_BY_THREAD_ID_CREATED_AT, ['threadId', 'createdAt'])
        }
      },
    })
  }
  return dbPromise
}
