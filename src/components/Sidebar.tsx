import { useAppContext } from '../context/AppProviders'
import { ThreadListItem } from './ThreadListItem'

export function Sidebar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { threadsState } = useAppContext()

  return (
    <div className="flex h-full w-64 flex-col border-r border-neutral-800 bg-neutral-950 p-2">
      <button
        type="button"
        onClick={() => void threadsState.addThread()}
        className="mb-2 rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900"
      >
        + New chat
      </button>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {threadsState.threads.map((thread) => (
          <ThreadListItem
            key={thread.id}
            thread={thread}
            active={thread.id === threadsState.activeThreadId}
            onSelect={() => threadsState.selectThread(thread.id)}
            onRename={(title) => void threadsState.renameThread(thread.id, title)}
            onDelete={() => void threadsState.removeThread(thread.id)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="mt-2 rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
      >
        Settings
      </button>
    </div>
  )
}
