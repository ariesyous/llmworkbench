import { useAppContext } from '../context/AppProviders'
import { useChat } from '../hooks/useChat'
import { useMessages } from '../hooks/useMessages'
import type { Thread } from '../types/thread'
import { Composer } from './Composer'
import { MessageList } from './MessageList'
import { ModelSelect } from './ModelSelect'
import { SystemPromptEditor } from './SystemPromptEditor'

export function ThreadView({ thread }: { thread: Thread }) {
  const { apiKeyState, modelsState, threadsState } = useAppContext()
  const { messages, setMessages } = useMessages(thread.id)
  const { isStreaming, sendMessage, stopGenerating } = useChat({
    thread,
    apiKey: apiKeyState.apiKey,
    messages,
    setMessages,
    onAutoTitle: (title) => void threadsState.renameThread(thread.id, title),
  })

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="space-y-2 border-b border-neutral-800 p-3">
        <div className="flex items-center gap-2">
          <ModelSelect
            models={modelsState.models}
            value={thread.model}
            loading={modelsState.loading}
            onChange={(model) => threadsState.updateThreadConfig(thread.id, { model })}
          />
        </div>
        <SystemPromptEditor
          value={thread.systemPrompt}
          onChange={(systemPrompt) =>
            threadsState.updateThreadConfig(thread.id, { systemPrompt })
          }
          label="System prompt"
        />
      </div>
      <MessageList messages={messages} />
      <Composer
        onSend={sendMessage}
        onStop={stopGenerating}
        isStreaming={isStreaming}
        disabled={!apiKeyState.hasApiKey}
      />
    </div>
  )
}
