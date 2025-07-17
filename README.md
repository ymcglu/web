# 智慧運勢系統 - Daily Insights

一個結合**易經占卜**、**紫微斗數**和**西洋星座**的現代化智慧運勢分析系統，為您提供深度個人化的每日指導。現已全面支援響應式設計，完美適配手機、平板和桌面設備。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.1.0-green.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![Responsive](https://img.shields.io/badge/responsive-✓-brightgreen.svg)

## ✨ 主要特色

### 🔮 三元合一分析系統

- **易經智慧** - 完整的 64 卦 384 爻辭解釋系統，傳統時間起卦法
- **紫微斗數** - 個人化命盤分析（天機、巨門星特質）
- **西洋星座** - 即時星象能量整合，多重 API 備援
- **AI 整合** - 智能化的個人化建議生成

### 📊 五層級智慧解析

1. **大吉大利** (元吉、大吉、亨) - 黃金機會指導
2. **順遂吉利** (吉、利) - 有利行動建議
3. **謹慎考驗** (凶、厲、吝) - 謹慎策略建議
4. **平和安全** (無咎、無悔) - 穩定維護方法
5. **觀察洞察** - 深度洞察和耐心指導

### 📱 全平台響應式體驗

- **完整自適應設計** - 桌面、平板、手機完美適配
- **斷點優化**：
  - 桌面版 (1024px+)：完整雙欄佈局
  - 平板版 (768px-1024px)：優化間距和字體
  - 手機版 (≤768px)：單欄佈局，導航置底
  - 小螢幕 (≤480px)：極致精簡化設計
- **觸控優化** - 符合 iOS 44px 最小觸控目標標準
- **手勢友好** - 平滑捲動和觸控回饋
- **PWA 就緒** - 支援離線瀏覽與應用安裝

### 🎨 動態視覺體驗

- **每日幸運色** - 基於卦象的色彩能量
- **動態主題** - 隨運勢變化的視覺體驗
- **色彩同步** - 主頁面與子頁面主題色自動同步
- **深色主題** - 護眼深色界面設計

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

**核心資料檔案** (位於 `/database/` 資料夾)

- `earthly-branches.js` - 地支數字對照 (12 entries)
- `gua-colors.js` - 八卦顏色對照 (8 color mappings)
- `hexagram-matrix.js` - 六十四卦矩陣 (64 hexagram combinations)
- `iching-hexagrams.js` - 主要易經卦辭與爻辭資料 (64 hexagrams × 6 lines)
- `iching-data.js` - 詳細卦象解釋 (judgment & explanation)
- `iching-palaces.js` - 易經八宮歸屬 (64 palace mappings)
- `yao-explanations.js` - 爻辭白話解釋 (384 line explanations)
- `bagua-map.js` - 先天八卦對照表 (8 primary trigrams)
- `iching-lines.js` - 爻線詳細資料
- `fuxi-bagua.png` - 伏羲先天八卦圖

> 📝 **資料庫重新整理** (2025-01-17)：統一命名規則、移除重複檔案、優化組織結構

## �️ 技術架構

## 🎯 使用說明

### 1. 每日運勢查詢

- 打開網站自動生成今日運勢
- 基於農曆精確時間起卦（梅花易數）
- 結合您的命盤特質與今日星象
- 提供具體的行動建議和時機指導

### 2. 智能分析特色

系統基於以下要素提供建議：

- **天機星特質**: 智慧、分析、學習能力
- **巨門星特質**: 溝通、口才、表達能力
- **時間起卦**: 傳統梅花易數起卦法
- **星象整合**: 即時西洋星座能量
- **多維度分析**: 爻辭、卦象、星座三重解析

### 3. 生活助手功能

- **美食推薦**: 智能隨機餐點推薦系統
- **Google 地圖整合**: 一鍵搜尋附近餐廳
- **時段分類**: 早餐、午餐、晚餐、宵夜專屬選項
- **主題色同步**: 頁面間視覺一致性

### 4. 響應式使用體驗

- **桌面版**: 雙欄佈局，完整功能展示
- **平板版**: 優化觸控體驗，適中的資訊密度
- **手機版**: 單欄佈局，導航置底，單手操作友好
- **離線模式**: 基礎功能離線可用

## 🏗️ 技術架構

### 前端技術棧

- **HTML5** - 語義化標籤和 PWA 支援
- **CSS3** - Flexbox、Grid、響應式設計、CSS 變量
- **Vanilla JavaScript** - 模組化 ES6+程式碼
- **lunar-javascript** - 農曆轉換庫

### 資料庫模組化架構

```
database/
├── earthly-branch-numbers.js  # 地支數字對照系統
├── gua-colors.js             # 八卦色彩能量對照
├── hexagram-matrix.js        # 六十四卦矩陣查詢
├── i-ching-data.js          # 完整易經卦辭資料（64卦384爻）
├── i-ching-lines.js         # 易經爻線資料
├── i-ching-palace.js        # 易經宮位對照
├── primal-bagua-map.js      # 先天八卦對照系統
└── yao-ci-explanations.js   # 爻辭白話解釋
```

### 響應式設計架構

- **移動優先策略** - 從小螢幕開始設計向上擴展
- **靈活斷點系統**：
  - 480px: 極小螢幕（舊款手機）
  - 768px: 平板直向模式分界點
  - 1024px: 平板橫向和小桌面
- **觸控優化**：
  - 最小 44px 觸控目標（符合 Apple HIG 標準）
  - 防誤觸間距設計
  - iOS Safari 兼容性
  - 平滑捲動支援
- **性能優化**：
  - 硬體加速動畫
  - 防止水平捲動
  - 字體渲染優化

### API 系統架構

- **多層代理備援**：4 個 CORS 代理服務
- **自動故障轉移**：智能 API 切換機制
- **錯誤處理**：完善的降級策略
- **AI 預測模式**：API 失效時的智能預測

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

- **移動設備**: 優化觸摸體驗，44px 最小觸控目標
- **桌面設備**: 充分利用螢幕空間，側邊欄導航
- **平板設備**: 平衡的閱讀體驗，自適應佈局
- **跨瀏覽器**: Chrome、Firefox、Safari、Edge 全支援
- **觸控優化**: iOS 平滑滾動，防誤觸設計
- **iframe 同步**: 子頁面主題色自動同步

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
