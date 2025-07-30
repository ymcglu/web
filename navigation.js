document.addEventListener("DOMContentLoaded", function () {
  // 檢測 backdrop-filter 支援並應用降級處理
  function detectBackdropFilterSupport() {
    const testElement = document.createElement("div");
    testElement.style.backdropFilter = "blur(1px)";
    testElement.style.webkitBackdropFilter = "blur(1px)";

    const supportsBackdropFilter =
      testElement.style.backdropFilter !== "" ||
      testElement.style.webkitBackdropFilter !== "";

    if (!supportsBackdropFilter) {
      document.documentElement.classList.add("no-backdrop-filter");
      console.log("Backdrop-filter not supported, applying fallback styles");
    }
  }

  // 動態調整玻璃效果強度
  function adjustGlassEffectIntensity() {
    // 檢測設備性能和偏好設定
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isLowEndDevice =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

    if (prefersReducedMotion || isLowEndDevice) {
      document.documentElement.style.setProperty("--glass-blur", "blur(8px)");
      document.documentElement.style.setProperty(
        "--glass-blur-light",
        "blur(4px)"
      );
    }
  }

  // 立即執行檢測
  detectBackdropFilterSupport();
  adjustGlassEffectIntensity();

  const navLinks = document.querySelectorAll(".nav-link");
  const contentSections = document.querySelectorAll(".content-section");
  const whatToEatIframe = document.querySelector(
    'iframe[src="eat/what_to_eat.html"]'
  );

  function syncIframeTheme() {
    // Ensure the global variable is available before trying to send it
    if (
      whatToEatIframe &&
      whatToEatIframe.contentWindow &&
      window.dailyThemeColor
    ) {
      const themeColorRgb = getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-color-rgb")
        .trim();
      const glassAccent = getComputedStyle(document.documentElement)
        .getPropertyValue("--glass-accent")
        .trim();
      const contrastColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-on-theme")
        .trim();

      whatToEatIframe.contentWindow.postMessage(
        {
          type: "themeUpdate",
          themeColor: window.dailyThemeColor,
          themeColorRgb: themeColorRgb,
          glassAccent: glassAccent,
          contrastColor: contrastColor,
        },
        "*"
      );
    }
  }

  function updateAriaAttributes(activeLink, activeSection) {
    // 更新所有導航連結的 aria-selected 屬性
    navLinks.forEach((link) => {
      link.setAttribute("aria-selected", "false");
    });
    activeLink.setAttribute("aria-selected", "true");

    // 更新所有內容區塊的 aria-hidden 屬性
    contentSections.forEach((section) => {
      section.setAttribute("aria-hidden", "true");
      section.setAttribute("tabindex", "-1");
    });
    activeSection.setAttribute("aria-hidden", "false");
    activeSection.setAttribute("tabindex", "0");

    // 將焦點移到新啟用的內容區塊
    activeSection.focus();
  }

  function switchTab(targetId, clickedLink) {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // 移除所有啟用狀態
    navLinks.forEach((navLink) => navLink.classList.remove("active"));

    // 先將所有內容區塊標記為非活動
    contentSections.forEach((section) => {
      section.classList.remove("active");
      section.style.display = "none";
    });

    // 添加新的啟用狀態
    clickedLink.classList.add("active");

    // 顯示目標區塊
    targetSection.style.display = "block";
    setTimeout(() => {
      targetSection.classList.add("active");
    }, 10);

    // 更新無障礙屬性
    updateAriaAttributes(clickedLink, targetSection);

    // 如果切換到美食推薦，同步主題
    if (targetId === "what-to-eat-content") {
      setTimeout(syncIframeTheme, 100);
    }

    // 平滑滾動到頂部（移動設備）
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // 點擊事件處理
  navLinks.forEach((link) => {
    if (link.dataset.target) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        switchTab(this.dataset.target, this);
      });

      // 鍵盤導航支援
      link.addEventListener("keydown", function (event) {
        const currentIndex = Array.from(navLinks).indexOf(this);
        let targetIndex = currentIndex;

        switch (event.key) {
          case "ArrowLeft":
          case "ArrowUp":
            event.preventDefault();
            targetIndex =
              currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
            navLinks[targetIndex].focus();
            break;
          case "ArrowRight":
          case "ArrowDown":
            event.preventDefault();
            targetIndex =
              currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
            navLinks[targetIndex].focus();
            break;
          case "Home":
            event.preventDefault();
            navLinks[0].focus();
            break;
          case "End":
            event.preventDefault();
            navLinks[navLinks.length - 1].focus();
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            switchTab(this.dataset.target, this);
            break;
        }
      });
    }
  });

  // iframe 載入完成後同步主題
  if (whatToEatIframe) {
    whatToEatIframe.addEventListener("load", syncIframeTheme);
  }

  // 響應式導航優化：在小螢幕上添加觸控反饋
  if ("ontouchstart" in window) {
    navLinks.forEach((link) => {
      link.addEventListener("touchstart", function () {
        this.style.transform = "scale(0.95)";
      });

      link.addEventListener("touchend", function () {
        this.style.transform = "";
      });
    });
  }

  // 視窗大小改變時的優化
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // 在視窗大小改變後重新同步iframe主題
      if (document.querySelector("#what-to-eat-content.active")) {
        syncIframeTheme();
      }
    }, 250);
  });

  // 初始化無障礙屬性和顯示狀態
  const activeLink = document.querySelector(".nav-link.active");
  const activeSection = document.querySelector(".content-section.active");

  // 確保只有活動區塊是可見的
  contentSections.forEach((section) => {
    if (section !== activeSection) {
      section.style.display = "none";
    } else {
      section.style.display = "block";
    }
  });

  if (activeLink && activeSection) {
    updateAriaAttributes(activeLink, activeSection);
  }
});
