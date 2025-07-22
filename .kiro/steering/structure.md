# 專案結構與組織

## 根目錄檔案

**核心應用程式：**

- `index.html` - 主要應用程式進入點，含側邊欄導覽
- `fortune.js` - 主要運勢占卜邏輯和 UI 生成
- `navigation.js` - 分頁切換和 iframe 主題同步
- `style.css` - 深色主題樣式與動態 CSS 自訂屬性

**文件：**

- `README.md` - 完整專案文件（繁體中文）
- `CHANGELOG.md` - 版本歷史和更新
- `CLAUDE.md` - 額外專案筆記

## 目錄結構

```
web/
├── index.html              # 主要應用程式進入點
├── fortune.js              # 核心運勢系統
├── navigation.js           # 導覽與主題同步
├── style.css              # 深色主題 + 動態色彩
├── database/              # 模組化易經資料
│   ├── database.js        # 合併資料匯出
│   └── [個別模組]          # 分離的資料檔案
├── eat/                   # 美食推薦模組
│   └── what_to_eat.html   # 獨立美食選擇器
└── .kiro/                 # IDE 設定
    └── steering/          # AI 助理指導
```

## 程式碼組織原則

**關注點分離：**

- 資料層：`/database/` 模組包含所有易經參考資料
- 邏輯層：`fortune.js` 處理占卜計算和分析
- 呈現層：`style.css` 和 HTML 模板
- 導覽層：`navigation.js` 管理 UI 狀態

**模組化資料架構：**
每種易經資料類型分離到獨立模組以便維護：

- 查詢表（卦象矩陣、宮位關聯）
- 參考資料（色彩、地支數字、卦象映射）
- 內容資料（卦象文本、爻辭解釋）

**元件隔離：**

- 主要運勢系統在根目錄自包含
- 美食推薦為隔離的 iframe 模組
- 每個模組可獨立開發/測試

## 命名慣例

**檔案：** HTML/CSS 使用 kebab-case，JavaScript 使用 camelCase
**變數：** JavaScript 使用 camelCase，CSS 自訂屬性使用 kebab-case
**函數：** camelCase 配合描述性名稱
**常數：** 設定使用 UPPER_SNAKE_CASE，資料物件使用 camelCase

## 開發工作流程

**新增功能：**

1. 資料變更放在適當的 `/database/` 模組
2. 邏輯變更在 `fortune.js` 或新的專用 JS 檔案
3. 樣式在 `style.css` 使用 CSS 自訂屬性
4. 更新 README.md 文件

**模組相依性：**

- `database.js` 必須在 `fortune.js` 之前載入
- `lunar-javascript` CDN 在應用程式腳本之前載入
- 導覽腳本最後載入以進行 DOM 操作
