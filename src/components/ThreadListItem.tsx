import { useState } from 'react'
import type { Thread } from '../types/thread'

interface ThreadListItemProps {
  thread: Thread
  active: boolean
  onSelect: () => void
  onRename: (title: string) => void
  onDelete: () => void
}

export function ThreadListItem({ thread, active, onSelect, onRename, onDelete }: ThreadListItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(thread.title)

  const commitRename = () => {
    setEditing(false)
    if (draft.trim() && draft !== thread.title) onRename(draft.trim())
    else setDraft(thread.title)
  }

  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-sm ${
        active ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-400 hover:bg-neutral-900'
      }`}
    >
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitRename()
            if (e.key === 'Escape') {
              setDraft(thread.title)
              setEditing(false)
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-transparent outline-none"
        />
      ) : (
        <span className="truncate" onDoubleClick={() => setEditing(true)}>
          {thread.title}
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="ml-2 hidden text-xs text-neutral-500 hover:text-red-400 group-hover:block"
      >
        ✕
      </button>
    </div>
  )
}
