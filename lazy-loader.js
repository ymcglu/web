/**
 * JavaScript 延遲載入機制
 * JavaScript Lazy Loading Mechanism
 *
 * 此模組負責：
 * 1. 延遲載入非關鍵 JavaScript 模組
 * 2. 基於使用者互動的動態載入
 * 3. 預測性載入
 * 4. 資源優先級管理
 */

class LazyLoader {
  constructor() {
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
    this.intersectionObserver = null;
    this.idleCallbackId = null;
    this.preloadQueue = [];

    this.init();
  }

  /**
   * 初始化延遲載入系統
   */
  init() {
    console.log("🔄 Lazy Loader 初始化中...");

    // 設置 Intersection Observer
    this.setupIntersectionObserver();

    // 設置預測性載入
    this.setupPredictiveLoading();

    // 設置使用者互動監聽
    this.setupInteractionListeners();

    // 開始延遲載入佇列處理
    this.processLazyLoadQueue();

    console.log("✅ Lazy Loader 已初始化");
  }

  /**
   * 設置 Intersection Observer
   */
  setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) {
      console.warn("⚠️ IntersectionObserver 不支援，使用降級方案");
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const moduleName = element.dataset.lazyModule;

            if (moduleName) {
              this.loadModule(moduleName);
              this.intersectionObserver.unobserve(element);
            }
          }
        });
      },
      {
        rootMargin: "50px 0px", // 提前 50px 開始載入
        threshold: 0.1,
      }
    );
  }

  /**
   * 設置預測性載入
   */
  setupPredictiveLoading() {
    // 基於使用者行為預測需要載入的模組
    const predictiveRules = [
      {
        trigger: () =>
          document.querySelector(
            '.nav-link[data-target="what-to-eat-content"]'
          ),
        action: () => this.preloadModule("what-to-eat-enhancements"),
        condition: () => !this.loadedModules.has("what-to-eat-enhancements"),
      },
      {
        trigger: () => window.innerWidth <= 768,
        action: () => this.preloadModule("mobile-optimizations"),
        condition: () => !this.loadedModules.has("mobile-optimizations"),
      },
      {
        trigger: () => "ontouchstart" in window,
        action: () => this.preloadModule("touch-enhancements"),
        condition: () => !this.loadedModules.has("touch-enhancements"),
      },
    ];

    // 檢查預測性規則
    predictiveRules.forEach((rule) => {
      if (rule.trigger() && rule.condition()) {
        this.schedulePreload(rule.action);
      }
    });
  }

  /**
   * 設置使用者互動監聽
   */
  setupInteractionListeners() {
    // 滑鼠懸停預載入
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest("[data-preload-on-hover]");
      if (target) {
        const moduleName = target.dataset.preloadOnHover;
        this.preloadModule(moduleName);
      }
    });

    // 點擊觸發載入
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-load-on-click]");
      if (target) {
        const moduleName = target.dataset.loadOnClick;
        this.loadModule(moduleName);
      }
    });

    // 焦點觸發載入
    document.addEventListener(
      "focus",
      (e) => {
        const target = e.target.closest("[data-load-on-focus]");
        if (target) {
          const moduleName = target.dataset.loadOnFocus;
          this.loadModule(moduleName);
        }
      },
      true
    );
  }

  /**
   * 處理延遲載入佇列
   */
  processLazyLoadQueue() {
    // 使用 requestIdleCallback 在瀏覽器空閒時處理
    const processQueue = (deadline) => {
      while (deadline.timeRemaining() > 0 && this.preloadQueue.length > 0) {
        const task = this.preloadQueue.shift();
        task();
      }

      if (this.preloadQueue.length > 0) {
        this.scheduleIdleCallback(processQueue);
      }
    };

    this.scheduleIdleCallback(processQueue);
  }

  /**
   * 排程空閒回調
   */
  scheduleIdleCallback(callback) {
    if ("requestIdleCallback" in window) {
      this.idleCallbackId = requestIdleCallback(callback, { timeout: 2000 });
    } else {
      // 降級方案
      setTimeout(callback, 100);
    }
  }

  /**
   * 排程預載入任務
   */
  schedulePreload(action) {
    this.preloadQueue.push(action);
  }

  /**
   * 載入模組
   */
  async loadModule(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      console.log(`✅ 模組已載入: ${moduleName}`);
      return Promise.resolve();
    }

    if (this.loadingPromises.has(moduleName)) {
      console.log(`🔄 模組載入中: ${moduleName}`);
      return this.loadingPromises.get(moduleName);
    }

    console.log(`🚀 開始載入模組: ${moduleName}`);

    const loadPromise = this.createLoadPromise(moduleName);
    this.loadingPromises.set(moduleName, loadPromise);

    try {
      await loadPromise;
      this.loadedModules.add(moduleName);
      this.loadingPromises.delete(moduleName);
      console.log(`✅ 模組載入完成: ${moduleName}`);

      // 觸發載入完成事件
      this.dispatchLoadEvent(moduleName);
    } catch (error) {
      this.loadingPromises.delete(moduleName);
      console.error(`❌ 模組載入失敗: ${moduleName}`, error);
      throw error;
    }

    return loadPromise;
  }

  /**
   * 預載入模組
   */
  async preloadModule(moduleName) {
    if (
      this.loadedModules.has(moduleName) ||
      this.loadingPromises.has(moduleName)
    ) {
      return;
    }

    console.log(`🔮 預載入模組: ${moduleName}`);
    return this.loadModule(moduleName);
  }

  /**
   * 建立載入 Promise
   */
  createLoadPromise(moduleName) {
    const moduleConfig = this.getModuleConfig(moduleName);

    if (!moduleConfig) {
      return Promise.reject(new Error(`未知模組: ${moduleName}`));
    }

    switch (moduleConfig.type) {
      case "script":
        return this.loadScript(moduleConfig);
      case "css":
        return this.loadCSS(moduleConfig);
      case "module":
        return this.loadESModule(moduleConfig);
      case "inline":
        return this.executeInlineModule(moduleConfig);
      default:
        return Promise.reject(
          new Error(`不支援的模組類型: ${moduleConfig.type}`)
        );
    }
  }

  /**
   * 獲取模組配置
   */
  getModuleConfig(moduleName) {
    const moduleConfigs = {
      "what-to-eat-enhancements": {
        type: "inline",
        priority: "low",
        execute: () => this.enhanceWhatToEatModule(),
      },
      "mobile-optimizations": {
        type: "inline",
        priority: "medium",
        execute: () => this.applyMobileOptimizations(),
      },
      "touch-enhancements": {
        type: "inline",
        priority: "medium",
        execute: () => this.applyTouchEnhancements(),
      },
      "advanced-animations": {
        type: "inline",
        priority: "low",
        execute: () => this.enableAdvancedAnimations(),
      },
      "accessibility-enhancements": {
        type: "inline",
        priority: "high",
        execute: () => this.enhanceAccessibility(),
      },
      "performance-monitor": {
        type: "inline",
        priority: "low",
        execute: () => this.enablePerformanceMonitoring(),
      },
    };

    return moduleConfigs[moduleName];
  }

  /**
   * 載入外部腳本
   */
  loadScript(config) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = config.src;
      script.async = true;

      if (config.crossorigin) {
        script.crossOrigin = config.crossorigin;
      }

      script.onload = () => {
        console.log(`✅ 腳本載入完成: ${config.src}`);
        resolve();
      };

      script.onerror = () => {
        console.error(`❌ 腳本載入失敗: ${config.src}`);
        reject(new Error(`Failed to load script: ${config.src}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * 載入 CSS
   */
  loadCSS(config) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = config.href;

      link.onload = () => {
        console.log(`✅ CSS 載入完成: ${config.href}`);
        resolve();
      };

      link.onerror = () => {
        console.error(`❌ CSS 載入失敗: ${config.href}`);
        reject(new Error(`Failed to load CSS: ${config.href}`));
      };

      document.head.appendChild(link);
    });
  }

  /**
   * 載入 ES 模組
   */
  async loadESModule(config) {
    try {
      const module = await import(config.src);
      console.log(`✅ ES 模組載入完成: ${config.src}`);
      return module;
    } catch (error) {
      console.error(`❌ ES 模組載入失敗: ${config.src}`, error);
      throw error;
    }
  }

  /**
   * 執行內聯模組
   */
  async executeInlineModule(config) {
    try {
      await config.execute();
      console.log(`✅ 內聯模組執行完成`);
    } catch (error) {
      console.error(`❌ 內聯模組執行失敗`, error);
      throw error;
    }
  }

  /**
   * 增強美食推薦模組
   */
  enhanceWhatToEatModule() {
    console.log("🍽️ 增強美食推薦模組");

    // 添加美食推薦的進階功能
    const iframe = document.querySelector('iframe[src="eat/what_to_eat.html"]');
    if (iframe) {
      // 增強 iframe 通訊
      iframe.addEventListener("load", () => {
        // 同步主題到 iframe
        if (window.dailyThemeColor) {
          iframe.contentWindow.postMessage(
            {
              type: "themeUpdate",
              themeColor: window.dailyThemeColor,
            },
            "*"
          );
        }
      });
    }

    // 添加美食推薦的鍵盤快捷鍵
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        const foodTab = document.querySelector(
          '[data-target="what-to-eat-content"]'
        );
        if (foodTab) {
          foodTab.click();
        }
      }
    });
  }

  /**
   * 應用行動裝置優化
   */
  applyMobileOptimizations() {
    console.log("📱 應用行動裝置優化");

    // 添加觸控反饋
    const addTouchFeedback = (element) => {
      element.addEventListener("touchstart", () => {
        element.style.transform = "scale(0.95)";
        element.style.transition = "transform 0.1s ease";
      });

      element.addEventListener("touchend", () => {
        element.style.transform = "";
      });
    };

    // 為所有可點擊元素添加觸控反饋
    document
      .querySelectorAll('.nav-link, button, [role="button"]')
      .forEach(addTouchFeedback);

    // 優化滾動性能
    document.body.style.webkitOverflowScrolling = "touch";

    // 添加行動裝置專用樣式
    const mobileCSS = `
            @media (max-width: 768px) {
                .nav-link {
                    min-height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .content-area {
                    padding: 15px;
                }
                
                #daily-fortune {
                    padding: 15px;
                    margin-top: 1rem;
                }
            }
        `;

    const style = document.createElement("style");
    style.textContent = mobileCSS;
    document.head.appendChild(style);
  }

  /**
   * 應用觸控增強
   */
  applyTouchEnhancements() {
    console.log("👆 應用觸控增強");

    // 添加觸覺反饋支援
    const addHapticFeedback = (element, intensity = "light") => {
      element.addEventListener("click", () => {
        if ("vibrate" in navigator) {
          const patterns = {
            light: [10],
            medium: [20],
            strong: [30],
          };
          navigator.vibrate(patterns[intensity] || patterns.light);
        }
      });
    };

    // 為重要按鈕添加觸覺反饋
    document
      .querySelectorAll(".nav-link")
      .forEach((el) => addHapticFeedback(el, "light"));
    document
      .querySelectorAll("button")
      .forEach((el) => addHapticFeedback(el, "medium"));

    // 添加手勢支援
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // 水平滑動切換分頁
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const navLinks = document.querySelectorAll(".nav-link");
        const activeLink = document.querySelector(".nav-link.active");
        const currentIndex = Array.from(navLinks).indexOf(activeLink);

        if (deltaX > 0 && currentIndex > 0) {
          // 向右滑動，切換到上一個分頁
          navLinks[currentIndex - 1].click();
        } else if (deltaX < 0 && currentIndex < navLinks.length - 1) {
          // 向左滑動，切換到下一個分頁
          navLinks[currentIndex + 1].click();
        }
      }
    });
  }

  /**
   * 啟用進階動畫
   */
  enableAdvancedAnimations() {
    console.log("✨ 啟用進階動畫");

    // 檢查使用者偏好
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      console.log("⚠️ 使用者偏好減少動畫，跳過進階動畫");
      return;
    }

    // 添加頁面切換動畫
    const addPageTransition = () => {
      const style = document.createElement("style");
      style.textContent = `
                .content-section {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    transform: translateX(20px);
                }
                
                .content-section.active {
                    transform: translateX(0);
                }
                
                .nav-link {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .nav-link:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
            `;
      document.head.appendChild(style);
    };

    addPageTransition();

    // 添加滾動視差效果
    const addParallaxEffect = () => {
      let ticking = false;

      const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll("[data-parallax]");

        parallaxElements.forEach((element) => {
          const speed = element.dataset.parallax || 0.5;
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
      };

      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });
    };

    addParallaxEffect();
  }

  /**
   * 增強無障礙功能
   */
  enhanceAccessibility() {
    console.log("♿ 增強無障礙功能");

    // 添加鍵盤導航增強
    const enhanceKeyboardNavigation = () => {
      document.addEventListener("keydown", (e) => {
        // Alt + 1: 跳到主要內容
        if (e.altKey && e.key === "1") {
          e.preventDefault();
          const mainContent = document.getElementById("main-content");
          if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: "smooth" });
          }
        }

        // Alt + 2: 跳到導航
        if (e.altKey && e.key === "2") {
          e.preventDefault();
          const nav = document.querySelector(".sidebar nav");
          if (nav) {
            const firstLink = nav.querySelector(".nav-link");
            if (firstLink) {
              firstLink.focus();
            }
          }
        }
      });
    };

    // 添加焦點指示器增強
    const enhanceFocusIndicators = () => {
      const style = document.createElement("style");
      style.textContent = `
                *:focus-visible {
                    outline: 2px solid var(--theme-color);
                    outline-offset: 2px;
                    border-radius: 4px;
                }
                
                .nav-link:focus-visible {
                    outline: 2px solid #ffffff;
                    outline-offset: 2px;
                }
            `;
      document.head.appendChild(style);
    };

    // 添加螢幕閱讀器支援
    const enhanceScreenReaderSupport = () => {
      // 為動態內容添加 aria-live 區域
      const fortuneContent = document.getElementById("fortune-content");
      if (fortuneContent) {
        fortuneContent.setAttribute("aria-live", "polite");
        fortuneContent.setAttribute("aria-atomic", "true");
      }

      // 為載入狀態添加說明
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const loadingElements = document.querySelectorAll(".loading");
            loadingElements.forEach((element) => {
              if (!element.getAttribute("aria-label")) {
                element.setAttribute("aria-label", "內容載入中，請稍候");
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    enhanceKeyboardNavigation();
    enhanceFocusIndicators();
    enhanceScreenReaderSupport();
  }

  /**
   * 啟用效能監控
   */
  enablePerformanceMonitoring() {
    console.log("📊 啟用效能監控");

    // 監控長任務
    if ("PerformanceObserver" in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.warn(`⚠️ 長任務檢測: ${entry.duration.toFixed(2)}ms`);
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ["longtask"] });
      } catch (e) {
        console.warn("長任務監控不支援");
      }
    }

    // 監控記憶體使用
    if ("memory" in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const used = Math.round(memory.usedJSHeapSize / 1048576);
        const total = Math.round(memory.totalJSHeapSize / 1048576);

        if (used / total > 0.8) {
          console.warn(`⚠️ 記憶體使用率過高: ${used}MB / ${total}MB`);
        }
      }, 30000); // 每 30 秒檢查一次
    }
  }

  /**
   * 觸發載入完成事件
   */
  dispatchLoadEvent(moduleName) {
    const event = new CustomEvent("moduleLoaded", {
      detail: { moduleName },
    });
    document.dispatchEvent(event);
  }

  /**
   * 觀察元素進入視窗
   */
  observeElement(element, moduleName) {
    if (this.intersectionObserver) {
      element.dataset.lazyModule = moduleName;
      this.intersectionObserver.observe(element);
    } else {
      // 降級方案：立即載入
      this.loadModule(moduleName);
    }
  }

  /**
   * 取消觀察元素
   */
  unobserveElement(element) {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
    }
  }

  /**
   * 獲取載入狀態
   */
  getLoadStatus() {
    return {
      loadedModules: Array.from(this.loadedModules),
      loadingModules: Array.from(this.loadingPromises.keys()),
      preloadQueueLength: this.preloadQueue.length,
    };
  }

  /**
   * 清理資源
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.idleCallbackId) {
      cancelIdleCallback(this.idleCallbackId);
    }

    this.loadedModules.clear();
    this.loadingPromises.clear();
    this.preloadQueue.length = 0;

    console.log("🧹 Lazy Loader 已清理");
  }
}

// 自動初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.lazyLoader = new LazyLoader();
  });
} else {
  window.lazyLoader = new LazyLoader();
}

// 導出供其他模組使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = LazyLoader;
}
