const askButton = document.getElementById("askAiBtn");
const clearButton = document.getElementById("clearAiBtn");
const questionInput = document.getElementById("aiQuestion");
const answerBox = document.getElementById("aiAnswer");

function setAnswer(message, state) {
  answerBox.textContent = message;
  answerBox.classList.remove("is-loading", "is-error", "is-success");
  if (state) {
    answerBox.classList.add(state);
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
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "AI 服務暫時無法使用。");
    }

    setAnswer(result.answer || "目前沒有回覆內容，請稍後再試。", "is-success");
  } catch (error) {
    setAnswer(`發生錯誤：${error.message}`, "is-error");
  } finally {
    askButton.disabled = false;
  }
}

if (askButton && clearButton && questionInput && answerBox) {
  askButton.addEventListener("click", askAi);
  clearButton.addEventListener("click", () => {
    questionInput.value = "";
    setAnswer("尚未提問，請先輸入問題。", "");
    questionInput.focus();
  });

  questionInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      askAi();
    }
  });
}
