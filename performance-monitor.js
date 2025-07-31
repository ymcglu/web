/**
 * 效能監控和報告系統
 * Performance Monitoring and Reporting System
 *
 * 此模組負責：
 * 1. 監控 Core Web Vitals 指標
 * 2. 追蹤資源載入效能
 * 3. 生成詳細的效能報告
 * 4. 提供效能優化建議
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      // Core Web Vitals
      fcp: null, // First Contentful Paint
      lcp: null, // Largest Contentful Paint
      fid: null, // First Input Delay
      cls: null, // Cumulative Layout Shift

      // 其他重要指標
      ttfb: null, // Time to First Byte
      domContentLoaded: null,
      loadComplete: null,

      // 自定義指標
      themeLoadTime: null,
      fortuneLoadTime: null,
      navigationTime: null,
    };

    this.observers = [];
    this.resourceTimings = [];
    this.userInteractions = [];
    this.performanceEntries = [];
    this.reportHistory = [];

    this.init();
  }

  /**
   * 初始化效能監控
   */
  init() {
    console.log("📊 Performance Monitor 初始化中...");

    // 設置 Performance Observer
    this.setupPerformanceObservers();

    // 監控頁面載入事件
    this.monitorPageLoadEvents();

    // 監控使用者互動
    this.monitorUserInteractions();

    // 監控自定義指標
    this.monitorCustomMetrics();

    // 設置定期報告
    this.setupPeriodicReporting();

    console.log("✅ Performance Monitor 已初始化");
  }

  /**
   * 設置 Performance Observer
   */
  setupPerformanceObservers() {
    if (!("PerformanceObserver" in window)) {
      console.warn("⚠️ PerformanceObserver 不支援");
      return;
    }

    // 監控 Paint 事件 (FCP)
    this.createObserver(["paint"], (entries) => {
      entries.forEach((entry) => {
        if (entry.name === "first-contentful-paint") {
          this.metrics.fcp = entry.startTime;
          console.log(`📊 FCP: ${entry.startTime.toFixed(2)}ms`);
          this.checkFCPThreshold(entry.startTime);
        }
      });
    });

    // 監控 LCP
    this.createObserver(["largest-contentful-paint"], (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      this.checkLCPThreshold(lastEntry.startTime);
    });

    // 監控 Layout Shift (CLS)
    this.createObserver(["layout-shift"], (entries) => {
      let clsValue = 0;
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      this.metrics.cls = (this.metrics.cls || 0) + clsValue;
      if (clsValue > 0) {
        console.log(
          `📊 CLS 增加: +${clsValue.toFixed(
            4
          )} (總計: ${this.metrics.cls.toFixed(4)})`
        );
        this.checkCLSThreshold(this.metrics.cls);
      }
    });

    // 監控 First Input Delay (FID)
    this.createObserver(["first-input"], (entries) => {
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        console.log(`📊 FID: ${this.metrics.fid.toFixed(2)}ms`);
        this.checkFIDThreshold(this.metrics.fid);
      });
    });

    // 監控 Navigation
    this.createObserver(["navigation"], (entries) => {
      entries.forEach((entry) => {
        this.metrics.ttfb = entry.responseStart - entry.requestStart;
        this.metrics.domContentLoaded =
          entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
        this.metrics.loadComplete = entry.loadEventEnd - entry.loadEventStart;

        console.log(`📊 TTFB: ${this.metrics.ttfb.toFixed(2)}ms`);
        console.log(
          `📊 DOM Content Loaded: ${this.metrics.domContentLoaded.toFixed(2)}ms`
        );
        console.log(
          `📊 Load Complete: ${this.metrics.loadComplete.toFixed(2)}ms`
        );
      });
    });

    // 監控資源載入
    this.createObserver(["resource"], (entries) => {
      entries.forEach((entry) => {
        this.resourceTimings.push({
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          type: this.getResourceType(entry.name),
          timestamp: entry.startTime,
        });
      });
    });

    // 監控長任務
    this.createObserver(["longtask"], (entries) => {
      entries.forEach((entry) => {
        console.warn(`⚠️ 長任務檢測: ${entry.duration.toFixed(2)}ms`);
        this.performanceEntries.push({
          type: "longtask",
          duration: entry.duration,
          startTime: entry.startTime,
          timestamp: Date.now(),
        });
      });
    });
  }

  /**
   * 建立 Performance Observer
   */
  createObserver(entryTypes, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ entryTypes });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`⚠️ 無法監控 ${entryTypes.join(", ")}:`, error.message);
    }
  }

  /**
   * 監控頁面載入事件
   */
  monitorPageLoadEvents() {
    // DOM Content Loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        const domTime = performance.now();
        console.log(`📊 DOM Ready: ${domTime.toFixed(2)}ms`);
      });
    }

    // Window Load
    window.addEventListener("load", () => {
      const loadTime = performance.now();
      console.log(`📊 Window Load: ${loadTime.toFixed(2)}ms`);

      // 延遲生成初始報告
      setTimeout(() => {
        this.generateReport("page-load");
      }, 1000);
    });

    // 頁面可見性變化
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.generateReport("page-hidden");
      } else {
        console.log("📊 頁面重新可見");
      }
    });

    // 頁面卸載前
    window.addEventListener("beforeunload", () => {
      this.generateReport("page-unload");
    });
  }

  /**
   * 監控使用者互動
   */
  monitorUserInteractions() {
    const interactionTypes = ["click", "keydown", "scroll", "touchstart"];

    interactionTypes.forEach((type) => {
      document.addEventListener(
        type,
        (event) => {
          const interaction = {
            type,
            timestamp: performance.now(),
            target: event.target.tagName,
            targetClass: event.target.className,
            targetId: event.target.id,
          };

          this.userInteractions.push(interaction);

          // 只保留最近 100 個互動記錄
          if (this.userInteractions.length > 100) {
            this.userInteractions.shift();
          }
        },
        { passive: true }
      );
    });
  }

  /**
   * 監控自定義指標
   */
  monitorCustomMetrics() {
    // 監控主題載入時間
    const originalSetProperty = document.documentElement.style.setProperty;
    document.documentElement.style.setProperty = function (
      property,
      value,
      priority
    ) {
      if (property === "--theme-color") {
        window.performanceMonitor.metrics.themeLoadTime = performance.now();
        console.log(
          `📊 主題載入時間: ${window.performanceMonitor.metrics.themeLoadTime.toFixed(
            2
          )}ms`
        );
      }
      return originalSetProperty.call(this, property, value, priority);
    };

    // 監控運勢載入時間
    const fortuneContainer = document.getElementById("fortune-content");
    if (fortuneContainer) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            // 檢查是否包含運勢內容
            const hasFortuneContent = Array.from(mutation.addedNodes).some(
              (node) =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.textContent.includes("易經") ||
                  node.textContent.includes("運勢"))
            );

            if (hasFortuneContent) {
              this.metrics.fortuneLoadTime = performance.now();
              console.log(
                `📊 運勢載入時間: ${this.metrics.fortuneLoadTime.toFixed(2)}ms`
              );
              observer.disconnect();
            }
          }
        });
      });

      observer.observe(fortuneContainer, { childList: true, subtree: true });
    }

    // 監控導航切換時間
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("nav-link")) {
        const startTime = performance.now();

        // 監控內容切換完成
        const targetId = event.target.dataset.target;
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const observer = new MutationObserver(() => {
              if (targetElement.classList.contains("active")) {
                this.metrics.navigationTime = performance.now() - startTime;
                console.log(
                  `📊 導航切換時間: ${this.metrics.navigationTime.toFixed(2)}ms`
                );
                observer.disconnect();
              }
            });

            observer.observe(targetElement, {
              attributes: true,
              attributeFilter: ["class"],
            });
          }
        }
      }
    });
  }

  /**
   * 設置定期報告
   */
  setupPeriodicReporting() {
    // 每 30 秒生成一次報告
    setInterval(() => {
      this.generateReport("periodic");
    }, 30000);

    // 每 5 分鐘清理舊數據
    setInterval(() => {
      this.cleanupOldData();
    }, 300000);
  }

  /**
   * 檢查 FCP 閾值
   */
  checkFCPThreshold(fcp) {
    if (fcp > 2500) {
      console.warn(`⚠️ FCP 過慢: ${fcp.toFixed(2)}ms (建議 < 1500ms)`);
      this.suggestOptimization("fcp", fcp);
    } else if (fcp > 1500) {
      console.log(`⚡ FCP 需要改善: ${fcp.toFixed(2)}ms (建議 < 1500ms)`);
    }
  }

  /**
   * 檢查 LCP 閾值
   */
  checkLCPThreshold(lcp) {
    if (lcp > 4000) {
      console.warn(`⚠️ LCP 過慢: ${lcp.toFixed(2)}ms (建議 < 2500ms)`);
      this.suggestOptimization("lcp", lcp);
    } else if (lcp > 2500) {
      console.log(`⚡ LCP 需要改善: ${lcp.toFixed(2)}ms (建議 < 2500ms)`);
    }
  }

  /**
   * 檢查 CLS 閾值
   */
  checkCLSThreshold(cls) {
    if (cls > 0.25) {
      console.warn(`⚠️ CLS 過高: ${cls.toFixed(4)} (建議 < 0.1)`);
      this.suggestOptimization("cls", cls);
    } else if (cls > 0.1) {
      console.log(`⚡ CLS 需要改善: ${cls.toFixed(4)} (建議 < 0.1)`);
    }
  }

  /**
   * 檢查 FID 閾值
   */
  checkFIDThreshold(fid) {
    if (fid > 300) {
      console.warn(`⚠️ FID 過慢: ${fid.toFixed(2)}ms (建議 < 100ms)`);
      this.suggestOptimization("fid", fid);
    } else if (fid > 100) {
      console.log(`⚡ FID 需要改善: ${fid.toFixed(2)}ms (建議 < 100ms)`);
    }
  }

  /**
   * 提供優化建議
   */
  suggestOptimization(metric, value) {
    const suggestions = {
      fcp: [
        "考慮內聯關鍵 CSS",
        "優化字體載入策略",
        "減少阻塞渲染的資源",
        "使用 CDN 加速資源載入",
      ],
      lcp: [
        "優化最大內容元素的載入",
        "預載入關鍵資源",
        "優化伺服器回應時間",
        "使用適當的圖片格式和大小",
      ],
      cls: [
        "為圖片和廣告設定尺寸屬性",
        "避免在現有內容上方插入內容",
        "使用 transform 動畫而非改變佈局屬性",
        "預載入字體以避免 FOIT/FOUT",
      ],
      fid: [
        "分割長任務",
        "優化第三方程式碼",
        "使用 Web Worker 處理計算密集任務",
        "延遲載入非關鍵 JavaScript",
      ],
    };

    const metricSuggestions = suggestions[metric] || [];
    console.group(`💡 ${metric.toUpperCase()} 優化建議`);
    metricSuggestions.forEach((suggestion) => {
      console.log(`• ${suggestion}`);
    });
    console.groupEnd();
  }

  /**
   * 獲取資源類型
   */
  getResourceType(url) {
    if (url.includes(".css")) return "css";
    if (url.includes(".js")) return "javascript";
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return "image";
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return "font";
    return "other";
  }

  /**
   * 生成效能報告
   */
  generateReport(trigger = "manual") {
    const report = {
      id: `report-${Date.now()}`,
      timestamp: new Date().toISOString(),
      trigger,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: this.getConnectionInfo(),
      metrics: { ...this.metrics },
      resourceTimings: [...this.resourceTimings],
      userInteractions: this.userInteractions.length,
      performanceEntries: [...this.performanceEntries],
      grade: this.calculateOverallGrade(),
      recommendations: this.generateRecommendations(),
    };

    // 計算載入時間分佈
    report.loadTimeDistribution = this.calculateLoadTimeDistribution();

    // 計算資源大小統計
    report.resourceStats = this.calculateResourceStats();

    // 儲存報告
    this.reportHistory.push(report);

    // 只保留最近 20 個報告
    if (this.reportHistory.length > 20) {
      this.reportHistory.shift();
    }

    // 輸出報告摘要
    this.logReportSummary(report);

    // 儲存到 localStorage
    this.saveReportToStorage(report);

    return report;
  }

  /**
   * 獲取連線資訊
   */
  getConnectionInfo() {
    if ("connection" in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData,
      };
    }
    return null;
  }

  /**
   * 計算整體等級
   */
  calculateOverallGrade() {
    const grades = {
      fcp: this.gradeMetric(this.metrics.fcp, [1500, 2500]),
      lcp: this.gradeMetric(this.metrics.lcp, [2500, 4000]),
      cls: this.gradeMetric(this.metrics.cls, [0.1, 0.25], true),
      fid: this.gradeMetric(this.metrics.fid, [100, 300]),
      ttfb: this.gradeMetric(this.metrics.ttfb, [200, 500]),
    };

    const validGrades = Object.values(grades).filter((g) => g !== null);
    if (validGrades.length === 0) return "Unknown";

    const scoreMap = { Good: 3, "Needs Improvement": 2, Poor: 1 };
    const averageScore =
      validGrades.reduce((sum, grade) => {
        return sum + scoreMap[grade];
      }, 0) / validGrades.length;

    if (averageScore >= 2.5) return "Good";
    if (averageScore >= 1.5) return "Needs Improvement";
    return "Poor";
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
   * 生成建議
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.fcp > 1500) {
      recommendations.push({
        type: "fcp",
        priority: "high",
        message: "考慮內聯關鍵 CSS 以改善首次內容繪製時間",
      });
    }

    if (this.metrics.lcp > 2500) {
      recommendations.push({
        type: "lcp",
        priority: "high",
        message: "優化最大內容元素的載入時間",
      });
    }

    if (this.metrics.cls > 0.1) {
      recommendations.push({
        type: "cls",
        priority: "medium",
        message: "減少累積版面偏移，為元素設定固定尺寸",
      });
    }

    if (this.metrics.fid > 100) {
      recommendations.push({
        type: "fid",
        priority: "medium",
        message: "優化 JavaScript 執行時間，考慮程式碼分割",
      });
    }

    // 檢查資源載入
    const slowResources = this.resourceTimings.filter((r) => r.duration > 1000);
    if (slowResources.length > 0) {
      recommendations.push({
        type: "resources",
        priority: "medium",
        message: `有 ${slowResources.length} 個資源載入時間超過 1 秒`,
      });
    }

    return recommendations;
  }

  /**
   * 計算載入時間分佈
   */
  calculateLoadTimeDistribution() {
    const distribution = {
      fast: 0, // < 1s
      medium: 0, // 1-3s
      slow: 0, // > 3s
    };

    this.resourceTimings.forEach((resource) => {
      if (resource.duration < 1000) {
        distribution.fast++;
      } else if (resource.duration < 3000) {
        distribution.medium++;
      } else {
        distribution.slow++;
      }
    });

    return distribution;
  }

  /**
   * 計算資源統計
   */
  calculateResourceStats() {
    const stats = {
      total: this.resourceTimings.length,
      totalSize: 0,
      byType: {},
    };

    this.resourceTimings.forEach((resource) => {
      stats.totalSize += resource.size || 0;

      const type = resource.type;
      if (!stats.byType[type]) {
        stats.byType[type] = { count: 0, size: 0 };
      }

      stats.byType[type].count++;
      stats.byType[type].size += resource.size || 0;
    });

    return stats;
  }

  /**
   * 輸出報告摘要
   */
  logReportSummary(report) {
    console.group(`📊 效能報告 (${report.trigger})`);
    console.log(`時間: ${report.timestamp}`);
    console.log(`整體等級: ${report.grade}`);
    console.log(
      `FCP: ${
        report.metrics.fcp ? report.metrics.fcp.toFixed(2) + "ms" : "未測量"
      }`
    );
    console.log(
      `LCP: ${
        report.metrics.lcp ? report.metrics.lcp.toFixed(2) + "ms" : "未測量"
      }`
    );
    console.log(
      `CLS: ${report.metrics.cls ? report.metrics.cls.toFixed(4) : "未測量"}`
    );
    console.log(
      `FID: ${
        report.metrics.fid ? report.metrics.fid.toFixed(2) + "ms" : "未測量"
      }`
    );
    console.log(`資源總數: ${report.resourceStats.total}`);
    console.log(`使用者互動: ${report.userInteractions}`);

    if (report.recommendations.length > 0) {
      console.log("建議:");
      report.recommendations.forEach((rec) => {
        console.log(`  • [${rec.priority}] ${rec.message}`);
      });
    }

    console.groupEnd();
  }

  /**
   * 儲存報告到 localStorage
   */
  saveReportToStorage(report) {
    try {
      const key = "performanceReports";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(report);

      // 只保留最近 10 個報告
      if (existing.length > 10) {
        existing.splice(0, existing.length - 10);
      }

      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.warn("無法儲存效能報告到 localStorage:", error);
    }
  }

  /**
   * 清理舊數據
   */
  cleanupOldData() {
    const fiveMinutesAgo = Date.now() - 300000;

    // 清理舊的資源時間記錄
    this.resourceTimings = this.resourceTimings.filter(
      (resource) => resource.timestamp > fiveMinutesAgo
    );

    // 清理舊的效能條目
    this.performanceEntries = this.performanceEntries.filter(
      (entry) => entry.timestamp > fiveMinutesAgo
    );

    console.log("🧹 已清理舊的效能數據");
  }

  /**
   * 獲取當前報告
   */
  getCurrentReport() {
    return this.generateReport("current");
  }

  /**
   * 獲取歷史報告
   */
  getHistoricalReports() {
    return [...this.reportHistory];
  }

  /**
   * 獲取儲存的報告
   */
  getSavedReports() {
    try {
      return JSON.parse(localStorage.getItem("performanceReports") || "[]");
    } catch (error) {
      console.warn("無法讀取儲存的效能報告:", error);
      return [];
    }
  }

  /**
   * 匯出報告為 JSON
   */
  exportReports() {
    const data = {
      current: this.getCurrentReport(),
      history: this.getHistoricalReports(),
      saved: this.getSavedReports(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * 清理資源
   */
  destroy() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });

    this.observers = [];
    this.resourceTimings = [];
    this.userInteractions = [];
    this.performanceEntries = [];

    console.log("🧹 Performance Monitor 已清理");
  }
}

// 自動初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.performanceMonitor = new PerformanceMonitor();
  });
} else {
  window.performanceMonitor = new PerformanceMonitor();
}

// 導出供其他模組使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = PerformanceMonitor;
}
