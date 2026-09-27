import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import type { Message } from '../types/thread'
import { CodeBlock } from './CodeBlock'

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
          isUser ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800 text-neutral-100'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{ code: CodeBlock }}
            >
              {message.content || (message.error ? '' : '…')}
            </ReactMarkdown>
          </div>
        )}
        {message.error && (
          <p className="mt-1 text-xs text-red-400">Error: {message.error}</p>
        )}
      </div>
    </div>
  )
}
