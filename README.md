# LLM Workbench

A local-only, no-backend chat UI for [OpenRouter.ai](https://openrouter.ai). Everything runs
entirely in your browser — your API key, chat threads, and settings are stored in
`localStorage`/IndexedDB and never touch any server other than OpenRouter's own API.

## Features

- Multiple independent chat threads, each with its own model and system prompt
- Live-fetched model dropdown from OpenRouter's `/models` endpoint
- Streaming, token-by-token responses with a stop button
- Markdown rendering with syntax-highlighted, copyable code blocks
- Global default model/system prompt for new threads

## Development

```bash
npm install
npm run dev
```

## Deployment

Pushing to `main` builds the app and deploys it to GitHub Pages via
`.github/workflows/deploy.yml`. Enable **Settings → Pages → Source: GitHub Actions** once,
and it deploys automatically after that.
