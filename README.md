# sort_report

Interactive sorting report site with AI Q&A support.

GitHub Pages URL:
https://petertasi.github.io/sort_report/

## Project structure

- `index.html`: home page + AI Q&A panel
- `quick_sort.html`, `bubble_sort.html`, `selection_sort.html`, `insertion_sort.html`: sorting demos
- `theme.css`: shared style
- `ai-assistant.js`: frontend Q&A logic
- `server.js`: backend API (`/api/ask`, `/api/health`)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create environment file

```bash
cp .env.example .env
```

3. Start server

```bash
npm start
```

4. Open browser

http://localhost:3000

## AI modes

Configure `.env`:

```env
AI_MODE=local
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=deepseek-r1:8b
OLLAMA_TIMEOUT_MS=25000
OPENAI_API_KEY=sk-your-real-key
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```

- `AI_MODE=local`: use local Ollama model (no API cost)
- `AI_MODE=rule`: use free rule-based assistant
- `AI_MODE=cloud`: use OpenAI API (paid)

## Ollama quick setup (macOS)

1. Install Ollama

```bash
brew install --cask ollama
```

2. Start Ollama app, then pull model

```bash
ollama pull deepseek-r1:8b
```

3. Verify model installed

```bash
ollama list
```

If local model is temporarily unavailable, backend auto-fallbacks to `rule-fallback`.

## API endpoints

- `POST /api/ask`
- `GET /api/health`

## School demo checklist

1. Keep Ollama app open
2. Confirm mode badge on home page shows local/rule-fallback
3. Prepare 2-3 pre-defined questions for stable demo flow

## Troubleshooting

- `EADDRINUSE: 3000`
	- kill previous process: `lsof -nP -iTCP:3000 -sTCP:LISTEN` then `kill <PID>`
- `mode: rule-fallback`
	- local model service unavailable or model name mismatch
	- check `ollama ps` and `ollama list`
- `insufficient_quota`
	- cloud mode quota issue, switch to local/rule mode

## Notes for school demo

- API key is only used on backend and should never be committed.
- In home page AI panel, press Cmd+Enter (or Ctrl+Enter) for quick submit.
