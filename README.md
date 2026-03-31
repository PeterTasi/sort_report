# sort_report

Sorting demo page for common sorting algorithms, now with AI Q&A support.

GitHub Pages URL:
https://petertasi.github.io/sort_report/

## Local run (with AI backend)

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Edit `.env` and choose AI mode:

```env
AI_MODE=local
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:7b-instruct
OPENAI_API_KEY=sk-your-real-key
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```

- `AI_MODE=local` (recommended for your demo): use local Ollama model, no API cost.
- `AI_MODE=rule`: free rule-based assistant, no API cost.
- `AI_MODE=cloud`: use OpenAI API (paid by usage).

## Ollama quick setup (macOS)

1. Install Ollama:

```bash
brew install --cask ollama
```

2. Start Ollama app once, then pull a model:

```bash
ollama pull qwen2.5:7b-instruct
```

3. Keep Ollama running and then start this project:

```bash
npm start
```

If local model is temporarily unavailable, backend will auto fallback to rule mode.

4. Start server:

```bash
npm start
```

5. Open in browser:

http://localhost:3000

## Notes for school demo

- The API key is only used on backend (`server.js`) and is not exposed in frontend.
- For stable demos, use `AI_MODE=local`; if local model fails, it auto-fallbacks to rule mode.
- In the home page AI panel, press Ctrl+Enter (or Cmd+Enter on macOS) to send question quickly.
- If backend is not running or `.env` is missing, AI panel will show a clear error message.
