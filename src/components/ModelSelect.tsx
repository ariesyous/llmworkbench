import { useMemo, useState } from 'react'
import type { OpenRouterModel } from '../types/openrouter'

interface ModelSelectProps {
  models: OpenRouterModel[]
  value: string
  onChange: (modelId: string) => void
  loading?: boolean
}

export function ModelSelect({ models, value, onChange, loading }: ModelSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = models.find((m) => m.id === value)

  const filtered = useMemo(() => {
    if (!query.trim()) return models
    const q = query.toLowerCase()
    return models.filter((m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q))
  }, [models, query])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full min-w-[220px] rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-left text-sm text-neutral-100"
      >
        {loading ? 'Loading models…' : selected?.name ?? value ?? 'Select a model'}
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full min-w-[280px] rounded-md border border-neutral-700 bg-neutral-900 shadow-lg">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models…"
            className="w-full border-b border-neutral-800 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
          />
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-neutral-500">No models found</li>
            )}
            {filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(m.id)
                    setOpen(false)
                    setQuery('')
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-800 ${
                    m.id === value ? 'text-neutral-100' : 'text-neutral-300'
                  }`}
                >
                  <div>{m.name}</div>
                  <div className="text-xs text-neutral-500">{m.id}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
