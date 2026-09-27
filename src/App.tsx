import { useState } from 'react'
import { ApiKeyGate } from './components/ApiKeyGate'
import { Sidebar } from './components/Sidebar'
import { SettingsPanel } from './components/SettingsPanel'
import { ThreadView } from './components/ThreadView'
import { AppProviders, useAppContext } from './context/AppProviders'

function AppShell() {
  const { threadsState } = useAppContext()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen bg-neutral-950 text-neutral-100">
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      {threadsState.activeThread ? (
        <ThreadView thread={threadsState.activeThread} />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-500">
          Create a new chat to get started.
        </div>
      )}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProviders>
      <ApiKeyGate>
        <AppShell />
      </ApiKeyGate>
    </AppProviders>
  )
}
