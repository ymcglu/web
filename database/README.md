# 智慧運勢系統 - 資料庫檔案說明

本資料夾包含智慧運勢系統所需的所有核心資料檔案。

## 📁 檔案結構說明

### 核心易經資料

- **`iching-hexagrams.js`** - 主要的易經六十四卦資料庫

  - 包含每一卦的名稱和六爻爻辭
  - 變數名稱：`iChingData`
  - 格式：`{ 卦號: { name: "卦名", lines: ["爻辭1", "爻辭2", ...] } }`

- **`iching-data.js`** - 詳細的卦象解釋資料

  - 包含卦辭、判斷詞和詳細解釋
  - 變數名稱：`iChingData`
  - 格式：包含 name, judgment, explanation 等詳細資訊

- **`hexagram-matrix.js`** - 六十四卦查找對照表
  - 用於根據上下卦組合查找對應的卦號
  - 變數名稱：`hexagramMatrix`
  - 格式：`{ "上卦下卦": 卦號 }`

### 八卦與宮位系統

- **`bagua-map.js`** - 先天八卦對照表

  - 變數名稱：`primalBaguaMap`
  - 格式：`{ 序號: "卦名" }`

- **`iching-palaces.js`** - 易經八宮歸屬表
  - 每個卦所屬的宮位
  - 變數名稱：`iChingPalace`
  - 格式：`{ 卦號: "宮位" }`

### 時間起卦系統

- **`earthly-branches.js`** - 地支數字對照表
  - 用於時間起卦計算
  - 變數名稱：`earthlyBranchNumbers`
  - 格式：`{ "地支": 數字 }`

### 爻辭與解釋

- **`yao-explanations.js`** - 爻辭白話解釋

  - 每條爻辭的現代化解釋
  - 變數名稱：`yaoCiExplanations`
  - 格式：`{ "爻辭": "解釋" }`

- **`iching-lines.js`** - 爻線資料（如果需要）
  - 爻線的詳細資料
  - 變數名稱：待確認

### 視覺與色彩

- **`gua-colors.js`** - 卦象對應色彩系統

  - 每個宮位對應的幸運色
  - 變數名稱：`guaColors`
  - 格式：`{ "宮位": { name: "色彩名稱", hex: "#色碼" } }`

- **`fuxi-bagua.png`** - 伏羲先天八卦圖
  - 八卦的視覺參考圖像

## 🔄 檔案依賴關係

```
fortune.js 依賴以下檔案：
├── earthly-branches.js (earthlyBranchNumbers)
├── bagua-map.js (primalBaguaMap)
├── iching-hexagrams.js (iChingData)
├── hexagram-matrix.js (hexagramMatrix)
├── iching-palaces.js (iChingPalace)
├── gua-colors.js (guaColors)
└── yao-explanations.js (yaoCiExplanations)
```

## 📝 使用說明

1. **載入順序**：所有資料檔案必須在 `fortune.js` 之前載入
2. **變數作用域**：所有變數都是全域變數，可直接在 `fortune.js` 中使用
3. **資料格式**：所有檔案都使用 const 宣告的 JavaScript 物件
4. **編碼格式**：所有檔案使用 UTF-8 編碼

## 🚀 最近更新（2025-01-17）

- ✅ 統一檔案命名規則（使用 kebab-case）
- ✅ 移除重複檔案
- ✅ 更新所有檔案引用路徑
- ✅ 優化檔案組織結構
- ✅ 中文檔案名稱改為英文

## 📊 檔案統計

- 總檔案數：10 個
- JavaScript 資料檔案：9 個
- 圖片檔案：1 個
- 總資料項目：約 1000+ 個易經相關資料點
