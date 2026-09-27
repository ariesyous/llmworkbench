import { useEffect, useState } from 'react'

interface SystemPromptEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function SystemPromptEditor({ value, onChange, label }: SystemPromptEditorProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  return (
    <div>
      {label && <label className="mb-1 block text-xs text-neutral-500">{label}</label>}
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onChange(draft)
        }}
        rows={3}
        placeholder="System prompt…"
        className="w-full resize-none rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
      />
    </div>
  )
}
