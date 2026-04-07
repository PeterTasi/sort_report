const OLLAMA_URL = "http://127.0.0.1:11434";
const OLLAMA_MODEL = "deepseek-r1:8b";

const askButton = document.getElementById("askAiBtn");
const clearButton = document.getElementById("clearAiBtn");
const questionInput = document.getElementById("aiQuestion");
const answerBox = document.getElementById("aiAnswer");
const modeBadge = document.getElementById("aiModeBadge");

function modeToLabel(mode) {
  if (mode === "local") return "本地模型 (Ollama)";
  if (mode === "rule") return "規則模式 (Ollama 未連線)";
  if (mode === "rule-fallback") return "規則備援 (Ollama 暫不可用)";
  return "未偵測";
}

function setMode(mode) {
  if (!modeBadge) return;
  modeBadge.textContent = `目前模式：${modeToLabel(mode)}`;
}

function setAnswer(message, state) {
  answerBox.textContent = message;
  answerBox.classList.remove("is-loading", "is-error", "is-success");
  if (state) answerBox.classList.add(state);
}

function buildRuleBasedAnswer(questionText) {
  const q = questionText.toLowerCase();

  if (q.includes("merge") || q.includes("合併")) {
    return "Merge Sort 是分治法，將陣列反覆對半切割，排序後再合併。時間複雜度恆為 O(n log n)，最差也不會退化，但空間複雜度為 O(n)，需要額外記憶體存放合併結果。";
  }
  if (q.includes("quick") || q.includes("快速") || q.includes("快排")) {
    return "Quick Sort 是分治法，平均時間複雜度為 O(n log n)，通常比 O(n^2) 類演算法快。最差情況會退化到 O(n^2)，常見於 pivot 選不好且資料分割極不平均。";
  }
  if (q.includes("bubble") || q.includes("氣泡")) {
    return "Bubble Sort 透過相鄰元素兩兩比較與交換，流程直覺、容易視覺化。時間複雜度平均與最差為 O(n^2)，適合教學示範，不適合大型資料。";
  }
  if (q.includes("selection") || q.includes("選擇")) {
    return "Selection Sort 每一輪都從未排序區間選最小值（或最大值）放到正確位置。比較次數固定約為 n(n-1)/2，時間複雜度為 O(n^2)。";
  }
  if (q.includes("insertion") || q.includes("插入")) {
    return "Insertion Sort 會把新元素插入到已排序區間中，概念像整理手上的撲克牌。平均與最差為 O(n^2)，但資料接近有序時表現很好。";
  }
  if (q.includes("複雜度") || q.includes("complexity") || q.includes("big o")) {
    return "在這份報告中，Merge Sort 與 Quick Sort 平均是 O(n log n)；Bubble/Selection/Insertion 平均為 O(n^2)。若資料量增大，O(n log n) 會比 O(n^2) 快很多。";
  }
  if (q.includes("比較") || q.includes("difference") || q.includes("差異")) {
    return "快速比較：Merge Sort 時間複雜度最穩定；Quick Sort 平均速度最佳；Bubble Sort 流程最直觀；Selection Sort 每輪選最值；Insertion Sort 在小型或近乎有序資料表現不錯。";
  }

  return "你可以詢問 Merge/Quick/Bubble/Selection/Insertion Sort 的原理、時間複雜度、優缺點與比較。若要使用 Ollama，請確認 Ollama 已啟動並設定 OLLAMA_ORIGINS=*。";
}

async function askOllamaDirectly(question) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        prompt: `你是排序法課堂助教，請用繁體中文回答且內容精簡，適合期中報告口頭說明。\n\n問題：${question}`
      }),
      signal: controller.signal
    });

    if (!response.ok) throw new Error("Ollama 回應錯誤");
    const data = await response.json();
    const answer = (data.response || "").trim();
    if (!answer) throw new Error("Ollama 回覆為空");
    return answer;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function askAi() {
  const question = questionInput.value.trim();

  if (!question) {
    setAnswer("請先輸入問題再送出。", "is-error");
    return;
  }

  setAnswer("AI 助教思考中...", "is-loading");
  askButton.disabled = true;

  try {
    const answer = await askOllamaDirectly(question);
    setAnswer(answer, "is-success");
    setMode("local");
  } catch (_error) {
    setAnswer(buildRuleBasedAnswer(question), "is-success");
    setMode("rule-fallback");
  } finally {
    askButton.disabled = false;
  }
}

async function initHealthStatus() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000)
    });
    setMode(response.ok ? "local" : "rule");
  } catch {
    setMode("rule");
  }
}

if (askButton && clearButton && questionInput && answerBox) {
  initHealthStatus();

  askButton.addEventListener("click", askAi);
  clearButton.addEventListener("click", () => {
    questionInput.value = "";
    setAnswer("尚未提問，請先輸入問題。", "");
    questionInput.focus();
  });

  questionInput.addEventListener("keydown", (event) => {
    if (event.isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askAi();
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      askAi();
    }
  });
}
