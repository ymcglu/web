# 智慧運勢系統

一個結合**易經占卜**、**紫微斗數**和**西洋星座**的現代化智慧運勢分析系統，為您提供深度個人化的每日指導。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)

## ✨ 主要特色

### 🔮 三元合一分析系統

- **易經智慧** - 完整的 64 卦 384 爻辭解釋系統，傳統時間起卦法
- **紫微斗數** - 個人化命盤分析
- **西洋星座** - 即時星象能量整合，多重 API 備援
- **AI 整合** - 智能化的個人化建議生成

### 📊 五層級智慧解析

1. **大吉大利** (元吉、大吉、亨) - 黃金機會指導
2. **順遂吉利** (吉、利) - 有利行動建議
3. **謹慎考驗** (凶、厲、吝) - 謹慎策略建議
4. **平和安全** (無咎、無悔) - 穩定維護方法
5. **觀察洞察** - 深度洞察和耐心指導

### 🎨 用戶體驗

- **每日幸運色** - 基於卦象的色彩能量
- **動態主題** - 隨運勢變化的視覺體驗
- **時間起卦** - 農曆時間精確起卦系統
- **多重備援** - 4 層 CORS 代理確保 API 可用性

## 快速開始

### 線上體驗

直接訪問：[智慧運勢系統](https://ymcglu.github.io/web/)

### 本地運行

```bash
# 克隆項目
git clone https://github.com/ymcglu/web.git

# 進入項目目錄
cd web

# 使用本地服務器運行
python -m http.server 8000
# 或使用 Node.js
npx serve .

# 在瀏覽器中打開
open http://localhost:8000
```

## 📁 項目結構

```
web/
├── index.html              # 主頁面
├── fortune.js              # 核心運勢系統
├── navigation.js           # 導航功能
├── style.css              # 樣式文件
├── database/              # 易經資料庫 (模組化)
│   ├── earthly-branch-numbers.js  # 地支數字對照
│   ├── gua-colors.js              # 八卦顏色對照
│   ├── hexagram-matrix.js         # 六十四卦矩陣
│   ├── i-ching-data.js           # 易經爻辭資料
│   ├── i-ching-lines.js          # 易經爻線資料
│   ├── i-ching-palace.js         # 易經宮位對照
│   ├── primal-bagua-map.js       # 先天八卦對照
│   └── yao-ci-explanations.js    # 爻辭白話解釋
├── eat/
│   └── what_to_eat.html   # 美食推薦模組
└── README.md              # 項目說明
```

## 🚀 技術架構

### 核心系統

- **前端**: 純 JavaScript (ES6+)、HTML5、CSS3
- **API 整合**: 多重 CORS 代理星座 API 系統
- **農曆轉換**: lunar-javascript 精確農曆計算
- **數據結構**: 模組化易經資料庫架構
- **響應式設計**: 支援桌面和移動設備

### 🔧 關鍵功能模組

#### 1. 易經時間起卦系統

```javascript
// 傳統梅花易數時間起卦法
function simulateIChing() {
  // 農曆時間轉換
  // 地支數字計算
  // 上卦、下卦、動爻計算
  // 六十四卦對應
}
```

#### 2. 多重 CORS 代理系統

```javascript
// 4 層代理備援，確保 API 可用性
const corsProxies = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/get?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://proxy.cors.sh/",
];
```

#### 3. 模組化資料庫結構

- `earthly-branch-numbers.js` - 地支數字對照 (12 entries)
- `gua-colors.js` - 八卦顏色對照 (8 color mappings)
- `hexagram-matrix.js` - 六十四卦矩陣 (64 hexagram combinations)
- `i-ching-data.js` - 易經爻辭資料 (hexagram data with lines)
- `yao-ci-explanations.js` - 爻辭白話解釋 (384 line explanations)

## 🎯 使用說明

### 1. 每日運勢查詢

- 打開網站自動生成今日運勢
- 基於農曆精確時間起卦
- 結合您的命盤特質與今日星象
- 提供具體的行動建議

### 2. 智能分析特色

系統基於以下要素提供建議：

- **天機星特質**: 智慧、分析、學習能力
- **巨門星特質**: 溝通、口才、表達能力
- **時間起卦**: 傳統梅花易數起卦法
- **星象整合**: 即時西洋星座能量

### 3. 幸運色應用

- 每日自動生成專屬幸運色
- 網站主題色彩隨之調整
- 基於八卦五行色彩理論

## 🔮 易經資料庫

### 完整性

- ✅ 64 卦完整收錄
- ✅ 384 爻辭全部解釋
- ✅ 現代白話文翻譯
- ✅ 實用生活指導
- ✅ 模組化結構設計
- ✅ 傳統時間起卦法

### 特色解釋

每個爻辭包含：

- **原文呈現** - 保持古典韻味
- **白話解釋** - 便於現代理解
- **生活應用** - 實際指導意義
- **情境分析** - 具體行動建議

## 特殊功能

### 符號識別系統

- **龍象徵**: 能量覺醒提醒
- **婚媾**: 情感關係指導
- **君子**: 品德修養重點
- **小人**: 人際關係警示
- **田獵**: 實際行動建議

## 視覺設計

### 主題色彩

- **動態變化**: 基於每日卦象
- **和諧搭配**: 五行色彩理論
- **用戶友好**: 自動對比度調整

### 響應式佈局

- **移動設備**: 優化觸摸體驗
- **桌面設備**: 充分利用螢幕空間
- **平板設備**: 平衡的閱讀體驗

## 🚧 未來規劃

### 短期目標

- [x] ~~新增農曆日期顯示~~
- [x] ~~增加更多星座 API 來源~~
- [x] ~~模組化資料庫結構~~
- [ ] 優化移動端體驗
- [ ] 新增分享功能

### 長期目標

- [ ] 個人運勢歷史記錄
- [ ] 多語言支援

## 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 代碼規範

- 使用 ES6+ 語法
- 保持代碼註釋完整
- 遵循項目既有的命名規範
- 確保跨瀏覽器兼容性

## 📄 版本歷史

詳細的版本更新記錄請參見 [CHANGELOG.md](CHANGELOG.md)

### 最新版本 v2.0.0 (2025-07-16)

- ✨ 新增傳統時間起卦系統
- 🔧 模組化資料庫結構重構
- 🌐 多重 CORS 代理備援系統
- 🎨 代碼結構優化與整理
- 📊 農曆精確計算整合

## 許可證

此項目採用 MIT 許可證 - 詳見 [LICENSE](LICENSE) 文件。

## 致謝

- **易經經典** - 中華文化的智慧寶庫
- **紫微斗數** - 古代天文學的結晶
- **現代占星學** - 西方心理學的融合

## 聯繫方式

- **項目主頁**: [GitHub](https://github.com/ymcglu/web)
- **問題回報**: [Issues](https://github.com/ymcglu/web/issues)

---

> _"易與天地準，故能彌綸天地之道。"_ - 《易經·繫辭上》

**願這個系統為您帶來智慧的指引與內心的平靜。**
