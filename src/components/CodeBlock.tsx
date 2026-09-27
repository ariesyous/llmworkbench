import { useState, type HTMLAttributes } from 'react'

interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  node?: unknown
}

export function CodeBlock({ children, className, node: _node, ...rest }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const isBlock = className?.includes('language-') || className?.includes('hljs')

  if (!isBlock) {
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    )
  }

  const handleCopy = async () => {
    const text = typeof children === 'string' ? children : String(children)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access denied; nothing else to do
    }
  }

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <code className={className} {...rest}>
        {children}
      </code>
    </div>
  )
}
