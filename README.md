# 排序演算法分析報告

學號：11320332  
姓名：蔡旻烜  
模擬頁面：[https://petertasi.github.io/sort_report/](https://petertasi.github.io/sort_report/)

報告內容涵蓋五種排序演算法的原理說明、複雜度分析，以及以 JavaScript 實作的互動模擬與效能比較。

---

## 氣泡排序法（Bubble Sort）

**原理：**  
反覆掃描陣列，每次比較相鄰兩個元素，若順序錯誤則互換。每完成一輪掃描，當輪最大值即確定就位於末端。若某輪無任何交換，代表陣列已排序完成，可提前結束（最佳化版本）。

**複雜度分析：**
| 情況 | 時間複雜度 |
|------|-----------|
| 最佳（已排序） | O(n) |
| 平均 | O(n²) |
| 最差（完全逆序） | O(n²) |
| 空間複雜度 | O(1) |

- **穩定性：** 穩定（相等元素不改變相對順序）
- **特點：** 概念最直覺，適合入門，但效率偏低，不適合大型資料集。

---

## 選擇排序法（Selection Sort）

**原理：**  
每一輪從未排序的部分掃描找出最小值，再與未排序區域的第一個元素交換。每輪結束後已排序區域擴大一格，重複 n-1 輪後完成排序。

**複雜度分析：**
| 情況 | 時間複雜度 |
|------|-----------|
| 最佳 | O(n²) |
| 平均 | O(n²) |
| 最差 | O(n²) |
| 空間複雜度 | O(1) |

- **穩定性：** 不穩定
- **特點：** 每輪最多只做一次交換，交換次數上限為 n-1 次，在交換成本高的情境下相對有優勢。

---

## 插入排序法（Insertion Sort）

**原理：**  
將陣列分為「已排序」與「未排序」兩區，每次取未排序區的第一個元素，向已排序區逐一比較並插入正確位置。重複直到未排序區為空。

**複雜度分析：**
| 情況 | 時間複雜度 |
|------|-----------|
| 最佳（已排序） | O(n) |
| 平均 | O(n²) |
| 最差（完全逆序） | O(n²) |
| 空間複雜度 | O(1) |

- **穩定性：** 穩定
- **特點：** 對小型資料或接近排序完成的資料效率較好；線上排序（即時插入新元素）的常用選擇。

---

## 合併排序法（Merge Sort）

**原理：**  
採用分治策略，將陣列對半切割，遞迴排序左右子陣列後再合併。合併時逐一比較兩半的首元素，按順序放入新陣列。

**複雜度分析：**
| 情況 | 時間複雜度 |
|------|-----------|
| 最佳 | O(n log n) |
| 平均 | O(n log n) |
| 最差 | O(n log n) |
| 空間複雜度 | O(n) |

- **穩定性：** 穩定
- **特點：** 時間複雜度恆為 O(n log n)，不受資料分布影響，但需要額外 O(n) 空間，適合大型資料集的穩定排序需求。

---

## 快速排序法（Quick Sort）

**原理：**  
選定一個 pivot（基準值），將陣列分為小於 pivot 的左半部與大於 pivot 的右半部，再對兩半部遞迴進行相同操作。

**複雜度分析：**
| 情況 | 時間複雜度 |
|------|-----------|
| 最佳 | O(n log n) |
| 平均 | O(n log n) |
| 最差（pivot每次選到最大/最小值） | O(n²) |
| 空間複雜度 | O(log n) |

- **穩定性：** 不穩定
- **特點：** 實際執行速度通常最快，快取命中率高；最差情況可透過隨機選取 pivot 有效避免。

---

## 綜合比較

| 演算法 | 最佳時間 | 平均時間 | 最差時間 | 空間複雜度 | 穩定性 |
|--------|---------|---------|---------|-----------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | 穩定 ✓ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | 不穩定 ✗ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | 穩定 ✓ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | 穩定 ✓ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | 不穩定 ✗ |

**實驗觀察（JavaScript 模擬，n = 100 ~ 10,000，每組 3 次取平均）：**

- Bubble / Selection / Insertion Sort：當 n 從 1,000 增至 10,000，執行時間約增加 100 倍，完全符合 O(n²) 預測。
- Quick Sort 與 Merge Sort：執行時間增幅約 10-15 倍，優勢在 n 越大時越明顯。
- Insertion Sort 在小型資料（n ≤ 100）中速度接近甚至超越 Quick Sort，原因是常數項小、快取效率佳。
- Merge Sort 在各種資料分布下表現最穩定，但記憶體用量是唯一 O(n) 的演算法。

---

## 學習心得

透過本次作業，我對五種排序演算法有了更深入的理解，不只是死記複雜度公式，而是透過互動視覺化與實驗數據真正體會到差異。

幾個印象最深的發現：

1. **O(n²) 的代價比想像中大**：模擬結果顯示，n 從 1,000 到 10,000 執行時間會暴增 100 倍，讓我深刻體會到選擇正確演算法的重要性。
2. **Insertion Sort 的隱藏優勢**：理論上跟 Bubble 一樣是 O(n²)，但實測發現在小資料和接近排序完成的情況下，Insertion Sort 表現明顯更好，讓我了解到理論複雜度不等於實際速度。
3. **Quick Sort 的風險與對策**：最差情況需要 O(n²)，但只要避免固定選第一個元素當 pivot，實際上幾乎不會遇到最差情況。
4. **實作的細節很重要**：每個演算法在實際 coding 時都有需要注意的邊界條件，例如 Bubble Sort 的提前終止最佳化、Merge Sort 的合併邏輯等。

整體而言，這次作業讓我從「知道這些名詞」進步到「能解釋並比較它們的差異」，也培養了用視覺化呈現演算法的能力。

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
