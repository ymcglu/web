# 技術架構與技術棧

## 核心技術

**前端技術棧：**

- 純 JavaScript (ES6+) - 無框架，原生 JS 確保最大相容性
- HTML5 語意化標記
- CSS3 自訂屬性實現動態主題
- 響應式設計支援桌面和行動裝置

**外部相依性：**

- `lunar-javascript@1.3.2` - 易經時間起卦所需的農曆計算
- 多重 CORS 代理服務確保 API 穩定性

## 架構模式

**模組化資料庫結構：**
所有易經資料組織在 `/database/` 內的獨立模組：

- `earthly-branch-numbers.js` - 12 地支對應數字映射
- `gua-colors.js` - 8 卦象色彩關聯
- `hexagram-matrix.js` - 64 卦查詢表
- `i-ching-data.js` - 完整卦象資料與爻辭文本
- `yao-ci-explanations.js` - 384 爻辭現代中文解釋
- `i-ching-palace.js` - 卦象對宮位/卦象關聯
- `primal-bagua-map.js` - 數字對卦象映射

**API 穩定性系統：**
4 層 CORS 代理備援系統確保 API 持續可用：

```javascript
const corsProxies = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/get?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://proxy.cors.sh/",
];
```

**動態主題：**
透過 JavaScript 更新 CSS 自訂屬性，基於每日卦象宮位色彩。

## 開發指令

**本地開發：**

```bash
# Python 簡易伺服器
python -m http.server 8000

# Node.js serve
npx serve .

# 在 http://localhost:8000 存取
```

**無建置流程：**
直接提供靜態檔案 - 無需編譯、打包或預處理。

## 檔案組織

- `/` - 主要應用程式檔案 (index.html, fortune.js, style.css, navigation.js)
- `/database/` - 模組化易經資料檔案
- `/eat/` - 美食推薦模組 (iframe 基礎)
- `/.kiro/` - Kiro IDE 設定和指導檔案

## 瀏覽器相容性

針對支援 ES6+ 的現代瀏覽器。使用功能檢測和優雅降級支援舊版瀏覽器。
