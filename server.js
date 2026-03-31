import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const AI_MODE = (process.env.AI_MODE || "rule").toLowerCase();
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "deepseek-r1:8b";
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 25000);

function buildRuleBasedAnswer(questionText) {
  const q = questionText.toLowerCase();

  if (q.includes("quick") || q.includes("快速") || q.includes("快排")) {
    return "Quick Sort 是分治法，平均時間複雜度為 O(n log n)，通常比 O(n^2) 類演算法快。最差情況會退化到 O(n^2)，常見於 pivot 選不好且資料分割極不平均。";
  }

  if (q.includes("bubble") || q.includes("氣泡")) {
    return "Bubble Sort 透過相鄰元素兩兩比較與交換，流程直覺、容易視覺化。時間複雜度平均與最差為 O(n^2)，適合教學示範，不適合大型資料。";
  }

  if (q.includes("selection") || q.includes("選擇")) {
    return "Selection Sort 每一輪都從未排序區間選最小值（或最大值）放到正確位置。它的比較次數固定約為 n(n-1)/2，時間複雜度為 O(n^2)。";
  }

  if (q.includes("insertion") || q.includes("插入")) {
    return "Insertion Sort 會把新元素插入到已排序區間中，概念像整理手上的撲克牌。平均與最差為 O(n^2)，但資料接近有序時表現很好。";
  }

  if (q.includes("複雜度") || q.includes("complexity") || q.includes("big o")) {
    return "在這份報告中，Quick Sort 平均是 O(n log n)，Bubble/Selection/Insertion 平均多為 O(n^2)。若資料量增大，O(n log n) 通常會比 O(n^2) 快很多。";
  }

  if (q.includes("比較") || q.includes("difference") || q.includes("差異")) {
    return "快速比較：Quick Sort 平均速度最佳；Bubble Sort 流程最直觀；Selection Sort 每輪選最值；Insertion Sort 在小型或近乎有序資料表現不錯。可依教學目的與資料特性選用。";
  }

  return "這是免費規則式模式的回覆：你可以詢問 Quick/Bubble/Selection/Insertion Sort 的原理、時間複雜度、優缺點與比較。我也可以幫你整理成期中報告口語版本。";
}

async function getCloudAnswer(question) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY 尚未設定，請先建立 .env 檔案。");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "你是排序法課堂助教，請用繁體中文回答。請優先解釋 Bubble/Quick/Selection/Insertion Sort，內容簡潔、可用於期中報告口頭說明。"
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: question
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`模型服務錯誤：${detail}`);
  }

  const data = await response.json();
  const answer = (data.output_text || "").trim();

  if (!answer) {
    throw new Error("模型回覆為空，請稍後再試。");
  }

  return answer;
}

async function getOllamaAnswer(question) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        prompt: `你是排序法課堂助教，請用繁體中文回答且內容精簡，適合期中報告口頭說明。\n\n問題：${question}`
      }),
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`本地模型逾時（>${OLLAMA_TIMEOUT_MS}ms）`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`本地模型服務錯誤：${detail}`);
  }

  const data = await response.json();
  const answer = (data.response || "").trim();

  if (!answer) {
    throw new Error("本地模型回覆為空，請稍後再試。");
  }

  return answer;
}

app.use(express.json());
app.use(express.static("."));

app.get("/api/health", (_req, res) => {
  return res.json({
    ok: true,
    mode: AI_MODE,
    ollamaModel: OLLAMA_MODEL,
    port: Number(PORT)
  });
});

app.post("/api/ask", async (req, res) => {
  const question = (req.body?.question || "").trim();

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  try {
    if (AI_MODE === "rule") {
      return res.json({ answer: buildRuleBasedAnswer(question), mode: "rule" });
    }

    if (AI_MODE === "local" || AI_MODE === "ollama") {
      try {
        const answer = await getOllamaAnswer(question);
        return res.json({ answer, mode: "local" });
      } catch (_error) {
        return res.json({
          answer: buildRuleBasedAnswer(question),
          mode: "rule-fallback"
        });
      }
    }

    const answer = await getCloudAnswer(question);

    return res.json({ answer, mode: "cloud" });
  } catch (error) {
    return res.status(500).json({ error: `伺服器錯誤：${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(
    `sort_report server running at http://localhost:${PORT} (AI_MODE=${AI_MODE}, OLLAMA_MODEL=${OLLAMA_MODEL})`
  );
});
