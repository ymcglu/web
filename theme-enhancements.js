/* ===== 主題系統增強 JavaScript ===== */

class ThemeEnhancer {
  constructor() {
    this.initializeThemeSystem();
    this.setupDynamicColors();
    this.initializeAnimations();
  }

  // 1. 增強色彩系統
  initializeThemeSystem() {
    // 擴展現有的卦象色彩系統
    this.enhancedGuaColors = {
      乾: { 
        name: "天界金", 
        primary: "#E5E4E2", 
        secondary: "#F5F5DC",
        accent: "#FFD700",
        gradient: "linear-gradient(135deg, #E5E4E2 0%, #F5F5DC 50%, #FFD700 100%)"
      },
      兌: { 
        name: "澤光銀", 
        primary: "#C0C0C0", 
        secondary: "#E6E6FA",
        accent: "#B0C4DE",
        gradient: "linear-gradient(135deg, #C0C0C0 0%, #E6E6FA 50%, #B0C4DE 100%)"
      },
      離: { 
        name: "烈焰紅", 
        primary: "#E34234", 
        secondary: "#FF6B6B",
        accent: "#FFB6C1",
        gradient: "linear-gradient(135deg, #E34234 0%, #FF6B6B 50%, #FFB6C1 100%)"
      },
      震: { 
        name: "春雷綠", 
        primary: "#66bb6a", 
        secondary: "#90EE90",
        accent: "#98FB98",
        gradient: "linear-gradient(135deg, #66bb6a 0%, #90EE90 50%, #98FB98 100%)"
      },
      巽: { 
        name: "風信青", 
        primary: "#008080", 
        secondary: "#20B2AA",
        accent: "#AFEEEE",
        gradient: "linear-gradient(135deg, #008080 0%, #20B2AA 50%, #AFEEEE 100%)"
      },
      坎: { 
        name: "深淵藍", 
        primary: "#4682B4", // 改善原本過暗的顏色
        secondary: "#6495ED",
        accent: "#87CEEB",
        gradient: "linear-gradient(135deg, #4682B4 0%, #6495ED 50%, #87CEEB 100%)"
      },
      艮: { 
        name: "山石黃", 
        primary: "#DAA520", 
        secondary: "#F0E68C",
        accent: "#FFFFE0",
        gradient: "linear-gradient(135deg, #DAA520 0%, #F0E68C 50%, #FFFFE0 100%)"
      },
      坤: { 
        name: "大地棕", 
        primary: "#8B4513", 
        secondary: "#CD853F",
        accent: "#DEB887",
        gradient: "linear-gradient(135deg, #8B4513 0%, #CD853F 50%, #DEB887 100%)"
      }
    };
  }

  // 2. 動態更新主題色彩
  updateThemeColor(guaName) {
    const colorScheme = this.enhancedGuaColors[guaName];
    if (!colorScheme) return;

    const root = document.documentElement;
    
    // 更新 CSS 變數
    root.style.setProperty('--theme-color', colorScheme.primary);
    root.style.setProperty('--theme-secondary', colorScheme.secondary);
    root.style.setProperty('--theme-accent', colorScheme.accent);
    root.style.setProperty('--theme-gradient', colorScheme.gradient);
    
    // 提取 RGB 值用於 rgba 函數
    const rgb = this.hexToRgb(colorScheme.primary);
    if (rgb) {
      root.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    // 通知 iframe 更新主題
    this.notifyIframeThemeChange(colorScheme);
    
    // 觸發主題變更動畫
    this.triggerThemeChangeAnimation();
  }

  // 3. 顏色轉換工具
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // 4. 通知 iframe 主題變更
  notifyIframeThemeChange(colorScheme) {
    const iframe = document.querySelector('.content-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'THEME_UPDATE',
        colors: colorScheme
      }, '*');
    }
  }

  // 5. 主題變更動畫
  triggerThemeChangeAnimation() {
    // 為主要元素添加過渡動畫
    const elements = document.querySelectorAll([
      'header h1',
      '.sidebar .nav-link.active',
      '.enhanced-button',
      '.modern-hexagram'
    ].join(', '));

    elements.forEach(el => {
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      el.classList.add('theme-changing');
      
      setTimeout(() => {
        el.classList.remove('theme-changing');
      }, 600);
    });
  }

  // 6. 動態背景效果
  setupDynamicColors() {
    // 創建動態背景粒子
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'theme-particle';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--theme-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.6;
        animation: particleFloat 8s linear infinite;
      `;
      
      // 隨機位置
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      
      document.body.appendChild(particle);
      
      // 移除粒子
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 8000);
    };

    // 定期創建粒子（當不是減少動畫偏好時）
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(createParticle, 2000);
    }
  }

  // 7. 初始化動畫系統
  initializeAnimations() {
    // 添加粒子動畫 CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0% {
          transform: translateY(0) translateX(0) scale(1);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) scale(0);
          opacity: 0;
        }
      }
      
      .theme-changing {
        animation: themeGlow 0.6s ease-in-out;
      }
      
      @keyframes themeGlow {
        0%, 100% { filter: brightness(1) drop-shadow(0 0 0 var(--theme-color)); }
        50% { filter: brightness(1.2) drop-shadow(0 0 10px var(--theme-color)); }
      }
    `;
    document.head.appendChild(style);
  }

  // 8. 智能對比度調整
  adjustContrastForAccessibility() {
    const root = document.documentElement;
    const currentTheme = getComputedStyle(root).getPropertyValue('--theme-color').trim();
    
    // 計算亮度
    const rgb = this.hexToRgb(currentTheme);
    if (!rgb) return;
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    // 根據亮度調整文字顏色
    if (brightness > 128) {
      root.style.setProperty('--theme-text-color', '#000000');
      root.style.setProperty('--theme-text-shadow', '0 1px 2px rgba(255, 255, 255, 0.5)');
    } else {
      root.style.setProperty('--theme-text-color', '#ffffff');
      root.style.setProperty('--theme-text-shadow', '0 1px 2px rgba(0, 0, 0, 0.5)');
    }
  }
}

// 9. 現代化互動效果
class InteractionEnhancer {
  constructor() {
    this.initializeHoverEffects();
    this.setupSmoothScrolling();
    this.initializeParallaxEffects();
  }

  // 初始化懸停效果
  initializeHoverEffects() {
    // 為卦象添加 3D 傾斜效果
    document.addEventListener('mousemove', (e) => {
      const hexagrams = document.querySelectorAll('.modern-hexagram');
      
      hexagrams.forEach(hex => {
        const rect = hex.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
          hex.style.transform = `
            perspective(1000px) 
            rotateX(${deltaY * 10}deg) 
            rotateY(${deltaX * 10}deg)
            translateZ(10px)
          `;
        } else {
          hex.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        }
      });
    });
  }

  // 設置平滑滾動
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // 初始化視差效果
  initializeParallaxEffects() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.flowing-background');
      
      parallaxElements.forEach(el => {
        const rate = scrolled * -0.5;
        el.style.transform = `translateY(${rate}px)`;
      });
    });
  }
}

// 10. 自適應字體系統
class TypographyEnhancer {
  constructor() {
    this.setupResponsiveTypography();
    this.initializeReadabilityFeatures();
  }

  setupResponsiveTypography() {
    // 根據螢幕尺寸動態調整字體大小
    const updateTypography = () => {
      const root = document.documentElement;
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      
      if (vw >= 1400) {
        root.style.setProperty('--base-font-size', '18px');
      } else if (vw >= 1024) {
        root.style.setProperty('--base-font-size', '16px');
      } else if (vw >= 768) {
        root.style.setProperty('--base-font-size', '15px');
      } else {
        root.style.setProperty('--base-font-size', '14px');
      }
    };

    updateTypography();
    window.addEventListener('resize', updateTypography);
  }

  initializeReadabilityFeatures() {
    // 檢測系統偏好
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
    }
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }
  }
}

// 11. 初始化所有增強功能
document.addEventListener('DOMContentLoaded', () => {
  window.themeEnhancer = new ThemeEnhancer();
  window.interactionEnhancer = new InteractionEnhancer();
  window.typographyEnhancer = new TypographyEnhancer();

  // 監聽主題變更事件
  document.addEventListener('themeChanged', (e) => {
    if (e.detail && e.detail.gua) {
      window.themeEnhancer.updateThemeColor(e.detail.gua);
    }
  });
});

// 12. 暴露給全域使用的函數
window.updateEnhancedTheme = (guaName) => {
  if (window.themeEnhancer) {
    window.themeEnhancer.updateThemeColor(guaName);
  }
};