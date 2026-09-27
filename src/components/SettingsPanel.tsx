import { useState } from 'react'
import { useAppContext } from '../context/AppProviders'
import { ModelSelect } from './ModelSelect'
import { SystemPromptEditor } from './SystemPromptEditor'

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { apiKeyState, settingsState, modelsState } = useAppContext()
  const [keyInput, setKeyInput] = useState('')

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-100">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-neutral-500 hover:text-neutral-300"
          >
            Close
          </button>
        </div>

        <div>
          <label className="mb-1 block text-xs text-neutral-500">OpenRouter API key</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder={apiKeyState.hasApiKey ? '••••••••••••' : 'sk-or-v1-...'}
              className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (keyInput.trim()) {
                  apiKeyState.saveApiKey(keyInput.trim())
                  setKeyInput('')
                }
              }}
              className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900"
            >
              Update
            </button>
            <button
              type="button"
              onClick={apiKeyState.removeApiKey}
              className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-300"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-neutral-500">Default model for new chats</label>
          <ModelSelect
            models={modelsState.models}
            value={settingsState.defaultModel}
            loading={modelsState.loading}
            onChange={settingsState.updateDefaultModel}
          />
        </div>

        <SystemPromptEditor
          label="Default system prompt for new chats"
          value={settingsState.defaultSystemPrompt}
          onChange={settingsState.updateDefaultSystemPrompt}
        />

        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {modelsState.fetchedAt
              ? `Models last refreshed: ${new Date(modelsState.fetchedAt).toLocaleString()}`
              : 'Models not fetched yet'}
          </span>
          <button
            type="button"
            onClick={() => void modelsState.refresh()}
            disabled={modelsState.loading}
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-neutral-300 disabled:opacity-50"
          >
            {modelsState.loading ? 'Refreshing…' : 'Refresh models'}
          </button>
        </div>
        {modelsState.error && <p className="text-xs text-red-400">{modelsState.error}</p>}
      </div>
    </div>
  )
}
