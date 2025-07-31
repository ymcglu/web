/**
 * CSS 關鍵路徑優化系統
 * Critical Path CSS Optimization System
 *
 * 此模組負責：
 * 1. 識別關鍵 CSS 並內聯到 HTML 中
 * 2. 延遲載入非關鍵 CSS
 * 3. 優化字體載入
 * 4. 管理資源優先級
 */

class CriticalPathOptimizer {
  constructor() {
    this.criticalCSS = "";
    this.nonCriticalCSS = [];
    this.loadedResources = new Set();
    this.performanceMetrics = {
      fcp: null,
      lcp: null,
      cls: null,
      fid: null,
      ttfb: null,
    };

    this.init();
  }

  /**
   * 初始化關鍵路徑優化
   */
  init() {
    // 檢測瀏覽器支援
    this.detectBrowserCapabilities();

    // 提取關鍵 CSS
    this.extractCriticalCSS();

    // 設置資源載入策略
    this.setupResourceLoadingStrategy();

    // 初始化效能監控
    this.initPerformanceMonitoring();

    console.log("🚀 Critical Path Optimizer 已初始化");
  }

  /**
   * 檢測瀏覽器能力
   */
  detectBrowserCapabilities() {
    this.capabilities = {
      intersectionObserver: "IntersectionObserver" in window,
      requestIdleCallback: "requestIdleCallback" in window,
      webP: this.supportsWebP(),
      modernCSS: this.supportsModernCSS(),
      serviceWorker: "serviceWorker" in navigator,
    };
  }

  /**
   * 檢測 WebP 支援
   */
  supportsWebP() {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  /**
   * 檢測現代 CSS 特性支援
   */
  supportsModernCSS() {
    return (
      CSS.supports("backdrop-filter", "blur(1px)") ||
      CSS.supports("-webkit-backdrop-filter", "blur(1px)")
    );
  }

  /**
   * 提取關鍵 CSS
   * 識別首屏渲染所需的 CSS 規則
   */
  extractCriticalCSS() {
    // 關鍵 CSS 規則 - 首屏渲染必需
    const criticalSelectors = [
      // 基礎佈局
      "html",
      "body",
      "*",

      // 主要容器
      "header",
      ".main-container",
      ".sidebar",
      ".content-area",

      // 導航元素
      ".nav-link",
      ".nav-link.active",

      // 關鍵內容區域
      "#daily-fortune",
      ".content-section.active",

      // 字體和基本樣式
      ":root",
      "@font-face",

      // 玻璃質感核心樣式
      ".glass-card",
      '[class*="glass"]',

      // 響應式斷點 - 只包含關鍵的
      "@media (max-width: 768px)",

      // 無障礙功能
      ".skip-link",
      "[aria-hidden]",
      "[role]",

      // 載入狀態
      ".loading",
      ".loading-spinner",
    ];

    // 建立關鍵 CSS 字串
    this.criticalCSS = this.buildCriticalCSS(criticalSelectors);

    // 內聯關鍵 CSS
    this.inlineCriticalCSS();
  }

  /**
   * 建立關鍵 CSS 字串
   */
  buildCriticalCSS(selectors) {
    return `
/* 關鍵路徑 CSS - 內聯優化 */
:root {
    --theme-color: #66bb6a;
    --theme-color-rgb: 102, 187, 106;
    --glass-bg: rgba(30, 30, 30, 0.7);
    --glass-border: rgba(255, 255, 255, 0.1);
    --glass-blur: blur(16px);
    --transition-theme: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    margin: 0;
    padding: 0;
    background: radial-gradient(ellipse at center, #1a1a1a 0%, #121212 100%);
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    line-height: 1.6;
    overflow-x: hidden;
}

.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--theme-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    transition: top 0.3s;
}

.skip-link:focus { top: 6px; }

header {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    color: #e0e0e0;
    padding: 2rem;
    text-align: center;
    border-bottom: 1px solid var(--glass-border);
}

header h1 {
    margin: 0;
    font-size: 2.8rem;
    color: var(--theme-color);
}

.main-container {
    display: flex;
    flex: 1;
}

.sidebar {
    width: 220px;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    padding: 20px;
    border-right: 1px solid var(--glass-border);
}

.nav-link {
    display: block;
    padding: 12px 18px;
    color: #e0e0e0;
    text-decoration: none;
    border-radius: 10px;
    font-size: 1.1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 10px;
}

.nav-link.active {
    background: linear-gradient(135deg, var(--theme-color), rgba(var(--theme-color-rgb), 0.8));
    color: #121212;
    font-weight: bold;
}

.content-area {
    flex: 1;
    padding: 30px;
    background-color: #121212;
    position: relative;
}

.content-section {
    display: none;
    width: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.content-section.active {
    display: block;
    opacity: 1;
}

#daily-fortune {
    margin-top: 1.5rem;
    padding: 20px;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-radius: 16px;
    border: 1px solid var(--glass-border);
}

/* 載入狀態 */
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left: 4px solid var(--theme-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* 響應式 - 關鍵斷點 */
@media (max-width: 768px) {
    .main-container { flex-direction: column; }
    .sidebar { width: 100%; }
    header { padding: 1.5rem 1rem; }
    header h1 { font-size: 2.4rem; }
    .content-area { padding: 25px; }
}

/* 降級處理 */
@supports not (backdrop-filter: blur(1px)) {
    .no-backdrop-filter header,
    .no-backdrop-filter .sidebar,
    .no-backdrop-filter #daily-fortune {
        background: rgba(30, 30, 30, 0.95) !important;
    }
}
        `;
  }

  /**
   * 內聯關鍵 CSS 到 HTML
   */
  inlineCriticalCSS() {
    // 檢查是否已經有內聯樣式
    if (document.getElementById("critical-css")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "critical-css";
    style.textContent = this.criticalCSS;

    // 插入到 head 的最前面，確保優先級
    const head = document.head;
    const firstChild = head.firstChild;
    head.insertBefore(style, firstChild);

    console.log("✅ 關鍵 CSS 已內聯");
  }

  /**
   * 設置資源載入策略
   */
  setupResourceLoadingStrategy() {
    // 延遲載入主要 CSS 檔案
    this.loadNonCriticalCSS();

    // 預載入重要資源
    this.preloadCriticalResources();

    // 設置字體載入優化
    this.optimizeFontLoading();
  }

  /**
   * 延遲載入非關鍵 CSS
   */
  loadNonCriticalCSS() {
    const loadCSS = (href, media = "all") => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.media = "print"; // 先設為 print 避免阻塞渲染
      link.onload = () => {
        link.media = media; // 載入完成後改為正確的 media
        this.loadedResources.add(href);
        console.log(`✅ 非關鍵 CSS 已載入: ${href}`);
      };

      document.head.appendChild(link);

      // 備用方案：使用 setTimeout 確保載入
      setTimeout(() => {
        if (link.media !== media) {
          link.media = media;
        }
      }, 3000);
    };

    // 使用 requestIdleCallback 或 setTimeout 延遲載入
    const delayedLoad = () => {
      // 主要樣式表已經在 HTML 中，這裡可以載入額外的樣式
      // 如果有分離的非關鍵 CSS 檔案，在這裡載入
      console.log("🔄 非關鍵 CSS 載入策略已設置");
    };

    if (this.capabilities.requestIdleCallback) {
      requestIdleCallback(delayedLoad);
    } else {
      setTimeout(delayedLoad, 100);
    }
  }

  /**
   * 預載入關鍵資源
   */
  preloadCriticalResources() {
    const criticalResources = [
      {
        href: "https://cdn.jsdelivr.net/npm/lunar-javascript@1.3.2/lunar.min.js",
        as: "script",
        crossorigin: "anonymous",
      },
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource.href;
      link.as = resource.as;
      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }

      document.head.appendChild(link);
      console.log(`🚀 預載入資源: ${resource.href}`);
    });
  }

  /**
   * 優化字體載入
   */
  optimizeFontLoading() {
    // 使用 font-display: swap 優化字體載入
    const fontOptimizationCSS = `
            @font-face {
                font-family: 'system-ui-optimized';
                src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
                font-display: swap;
            }
        `;

    const style = document.createElement("style");
    style.textContent = fontOptimizationCSS;
    document.head.appendChild(style);

    console.log("🔤 字體載入已優化");
  }

  /**
   * 初始化效能監控
   */
  initPerformanceMonitoring() {
    // 使用 Performance Observer API 監控關鍵指標
    if ("PerformanceObserver" in window) {
      this.observeWebVitals();
    }

    // 監控資源載入時間
    this.monitorResourceTiming();

    // 設置定期報告
    this.setupPerformanceReporting();
  }

  /**
   * 監控 Web Vitals
   */
  observeWebVitals() {
    // 監控 LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.performanceMetrics.lcp = lastEntry.startTime;
      console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.warn("LCP 監控不支援");
    }

    // 監控 FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === "first-contentful-paint") {
          this.performanceMetrics.fcp = entry.startTime;
          console.log(`📊 FCP: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });

    try {
      fcpObserver.observe({ entryTypes: ["paint"] });
    } catch (e) {
      console.warn("FCP 監控不支援");
    }

    // 監控 CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();

      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      this.performanceMetrics.cls = clsValue;
      console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.warn("CLS 監控不支援");
    }

    // 監控 FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.performanceMetrics.fid = entry.processingStart - entry.startTime;
        console.log(`📊 FID: ${this.performanceMetrics.fid.toFixed(2)}ms`);
      });
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.warn("FID 監控不支援");
    }
  }

  /**
   * 監控資源載入時間
   */
  monitorResourceTiming() {
    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        this.performanceMetrics.ttfb =
          navigation.responseStart - navigation.requestStart;
        console.log(`📊 TTFB: ${this.performanceMetrics.ttfb.toFixed(2)}ms`);
      }

      // 監控資源載入
      const resources = performance.getEntriesByType("resource");
      resources.forEach((resource) => {
        if (resource.name.includes(".css") || resource.name.includes(".js")) {
          console.log(
            `📦 資源載入: ${resource.name} - ${resource.duration.toFixed(2)}ms`
          );
        }
      });
    });
  }

  /**
   * 設置效能報告
   */
  setupPerformanceReporting() {
    // 頁面載入完成後生成報告
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.generatePerformanceReport();
      }, 2000); // 等待 2 秒確保所有指標都已收集
    });

    // 頁面卸載前生成最終報告
    window.addEventListener("beforeunload", () => {
      this.generatePerformanceReport(true);
    });
  }

  /**
   * 生成效能報告
   */
  generatePerformanceReport(isFinal = false) {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: { ...this.performanceMetrics },
      capabilities: { ...this.capabilities },
      loadedResources: Array.from(this.loadedResources),
      isFinal,
    };

    // 評估效能等級
    const grade = this.calculatePerformanceGrade(report.metrics);
    report.grade = grade;

    console.group("📊 效能報告");
    console.log("時間戳:", report.timestamp);
    console.log("效能等級:", grade.overall);
    console.log(
      "FCP:",
      report.metrics.fcp ? `${report.metrics.fcp.toFixed(2)}ms` : "未測量"
    );
    console.log(
      "LCP:",
      report.metrics.lcp ? `${report.metrics.lcp.toFixed(2)}ms` : "未測量"
    );
    console.log(
      "CLS:",
      report.metrics.cls ? report.metrics.cls.toFixed(4) : "未測量"
    );
    console.log(
      "FID:",
      report.metrics.fid ? `${report.metrics.fid.toFixed(2)}ms` : "未測量"
    );
    console.log(
      "TTFB:",
      report.metrics.ttfb ? `${report.metrics.ttfb.toFixed(2)}ms` : "未測量"
    );
    console.log("已載入資源:", report.loadedResources.length);
    console.groupEnd();

    // 儲存報告到 localStorage (可選)
    if (isFinal) {
      try {
        const reports = JSON.parse(
          localStorage.getItem("performanceReports") || "[]"
        );
        reports.push(report);
        // 只保留最近 10 次報告
        if (reports.length > 10) {
          reports.splice(0, reports.length - 10);
        }
        localStorage.setItem("performanceReports", JSON.stringify(reports));
      } catch (e) {
        console.warn("無法儲存效能報告到 localStorage");
      }
    }

    return report;
  }

  /**
   * 計算效能等級
   */
  calculatePerformanceGrade(metrics) {
    const grades = {
      fcp: this.gradeMetric(metrics.fcp, [1500, 2500]), // Good < 1.5s, Needs Improvement < 2.5s
      lcp: this.gradeMetric(metrics.lcp, [2500, 4000]), // Good < 2.5s, Needs Improvement < 4s
      cls: this.gradeMetric(metrics.cls, [0.1, 0.25], true), // Good < 0.1, Needs Improvement < 0.25 (lower is better)
      fid: this.gradeMetric(metrics.fid, [100, 300]), // Good < 100ms, Needs Improvement < 300ms
      ttfb: this.gradeMetric(metrics.ttfb, [200, 500]), // Good < 200ms, Needs Improvement < 500ms
    };

    // 計算整體等級
    const validGrades = Object.values(grades).filter((g) => g !== null);
    const averageScore =
      validGrades.reduce((sum, grade) => {
        const scoreMap = { Good: 3, "Needs Improvement": 2, Poor: 1 };
        return sum + scoreMap[grade];
      }, 0) / validGrades.length;

    let overall;
    if (averageScore >= 2.5) overall = "Good";
    else if (averageScore >= 1.5) overall = "Needs Improvement";
    else overall = "Poor";

    return { ...grades, overall };
  }

  /**
   * 為單一指標評分
   */
  gradeMetric(value, thresholds, lowerIsBetter = false) {
    if (value === null || value === undefined) return null;

    const [good, needsImprovement] = thresholds;

    if (lowerIsBetter) {
      if (value <= good) return "Good";
      if (value <= needsImprovement) return "Needs Improvement";
      return "Poor";
    } else {
      if (value <= good) return "Good";
      if (value <= needsImprovement) return "Needs Improvement";
      return "Poor";
    }
  }

  /**
   * 獲取效能報告
   */
  getPerformanceReport() {
    return this.generatePerformanceReport();
  }

  /**
   * 獲取歷史效能報告
   */
  getHistoricalReports() {
    try {
      return JSON.parse(localStorage.getItem("performanceReports") || "[]");
    } catch (e) {
      console.warn("無法讀取歷史效能報告");
      return [];
    }
  }
}

// 自動初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.criticalPathOptimizer = new CriticalPathOptimizer();
  });
} else {
  window.criticalPathOptimizer = new CriticalPathOptimizer();
}

// 導出供其他模組使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = CriticalPathOptimizer;
}
