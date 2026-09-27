import { useState, type ReactNode } from 'react'
import { useAppContext } from '../context/AppProviders'

export function ApiKeyGate({ children }: { children: ReactNode }) {
  const { apiKeyState } = useAppContext()
  const [input, setInput] = useState('')

  if (apiKeyState.hasApiKey) return <>{children}</>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    apiKeyState.saveApiKey(input.trim())
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg"
      >
        <h1 className="mb-2 text-lg font-semibold text-neutral-100">Connect OpenRouter</h1>
        <p className="mb-4 text-sm text-neutral-400">
          Enter your OpenRouter.ai API key to start chatting. It's stored only in this browser's
          local storage and never leaves your machine except to call OpenRouter directly.
        </p>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="sk-or-v1-..."
          className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
        >
          Save and continue
        </button>
        <p className="mt-3 text-xs text-neutral-500">
          Don't have a key?{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Get one at openrouter.ai/keys
          </a>
        </p>
      </form>
    </div>
  )
}
