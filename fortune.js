document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Fortune.js 載入完成:", new Date().toLocaleString());

  // =========================================================================
  // 紫微斗數核心命盤分析
  // =========================================================================
  const zwdsProfile = {
    lifePalace: "命宮在寅",
    mainStars: "天機、巨門",
    analysis:
      "您的命宮主星為「天機」與「巨門」，這代表您擁有極高的智慧、卓越的思考與分析能力，以及出色的口才與溝通技巧。天機星賦予您善良、敏銳的觀察力與強大的學習能力，對任何事物都有深入研究的興趣。巨門星則讓您具備雄辯的口才與追根究柢的精神，凡事都要求真、求實。這兩顆星的組合，使您成為一個天生的策略家、分析師或諮商師。然而，這也可能帶來思慮過度、內心敏感、以及有時言語過於直接的挑戰。您的核心人生課題，在於如何善用您強大的思辨能力來洞察事物，同時保持內心的平和，並用溫和而有智慧的方式與世界溝通。",
  };

  // =========================================================================
  // 核心功能函數
  // =========================================================================

  // 八卦爻線對應表 (從下到上)
  const baguaLines = {
    乾: ["—", "—", "—"], // 三陽爻
    兌: ["—", "—", "- -"], // 上陰下二陽
    離: ["—", "- -", "—"], // 中陰上下陽
    震: ["- -", "—", "—"], // 下陰上二陽
    巽: ["—", "- -", "- -"], // 上陽下二陰
    坎: ["- -", "—", "- -"], // 中陽上下陰
    艮: ["- -", "- -", "—"], // 上陽下二陰
    坤: ["- -", "- -", "- -"], // 三陰爻
  };

  // 生成六爻卦象圖示
  function generateHexagramVisual(hexagramName, changingLine) {
    let upperGuaName, lowerGuaName;

    // 如果是八卦本身（重卦）
    if (
      hexagramName === "乾" ||
      hexagramName === "坤" ||
      hexagramName === "坎" ||
      hexagramName === "離" ||
      hexagramName === "震" ||
      hexagramName === "巽" ||
      hexagramName === "艮" ||
      hexagramName === "兌"
    ) {
      upperGuaName = lowerGuaName = hexagramName;
    } else {
      // 從hexagramMatrix反推上下卦
      const hexagramKey = Object.keys(hexagramMatrix).find((key) => {
        const hexNum = hexagramMatrix[key];
        return iChingData[hexNum] && iChingData[hexNum].name === hexagramName;
      });

      if (hexagramKey && hexagramKey.length === 2) {
        upperGuaName = hexagramKey.charAt(0);
        lowerGuaName = hexagramKey.charAt(1);
      } else {
        // 備用方案：使用預設
        upperGuaName = lowerGuaName = "乾";
      }
    }

    const upperLines = baguaLines[upperGuaName] || ["—", "—", "—"];
    const lowerLines = baguaLines[lowerGuaName] || ["—", "—", "—"];

    // 組合六爻 (從下到上：下卦三爻 + 上卦三爻)
    const allLines = [...lowerLines, ...upperLines];

    // 數字轉中文
    const chineseNumbers = ["一", "二", "三", "四", "五", "六"];

    // 標記變爻 (changingLine 是0-5的索引)，從上到下排列
    let hexagramRows = [];
    for (let i = 5; i >= 0; i--) {
      const isChanging = i === changingLine;
      const prefix = isChanging ? "●" : "○";
      const spacing = allLines[i] === "—" ? "━━━" : "━ ━";
      const lineNumber = chineseNumbers[i];
      
      hexagramRows.push({
        symbol: `${prefix} ${spacing}`,
        number: lineNumber
      });
    }

    return {
      rows: hexagramRows,
      upperGua: upperGuaName,
      lowerGua: lowerGuaName,
    };
  }

  // 色彩對比度檢測和自動調整機制
  function getContrastingTextColor(hexColor) {
    if (hexColor.startsWith("#")) {
      hexColor = hexColor.slice(1);
    }
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  }

  // 計算色彩對比度比例 (WCAG 標準)
  function calculateContrastRatio(color1, color2) {
    const getLuminance = (hex) => {
      if (hex.startsWith("#")) hex = hex.slice(1);
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const toLinear = (c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  // 自動調整色彩以符合對比度要求
  function adjustColorForContrast(
    hexColor,
    backgroundColor = "#121212",
    targetRatio = 4.5
  ) {
    let currentRatio = calculateContrastRatio(hexColor, backgroundColor);

    if (currentRatio >= targetRatio) {
      return hexColor;
    }

    // 如果對比度不足，調整亮度
    const rgb = hexToRgb(hexColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // 根據背景色決定調整方向
    const isBackgroundDark =
      calculateContrastRatio("#ffffff", backgroundColor) >
      calculateContrastRatio("#000000", backgroundColor);

    let adjustedL = hsl.l;
    const step = 0.05;
    const maxIterations = 20;
    let iterations = 0;

    while (currentRatio < targetRatio && iterations < maxIterations) {
      if (isBackgroundDark) {
        adjustedL = Math.min(1, adjustedL + step);
      } else {
        adjustedL = Math.max(0, adjustedL - step);
      }

      const adjustedRgb = hslToRgb(hsl.h, hsl.s, adjustedL);
      const adjustedHex = rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
      currentRatio = calculateContrastRatio(adjustedHex, backgroundColor);

      if (currentRatio >= targetRatio) {
        return adjustedHex;
      }

      iterations++;
    }

    return hexColor; // 如果無法調整到目標對比度，返回原色
  }

  // 輔助函數：hex 轉 rgb
  function hexToRgb(hex) {
    if (hex.startsWith("#")) hex = hex.slice(1);
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }

  // 輔助函數：rgb 轉 hex
  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // 輔助函數：rgb 轉 hsl
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h, s, l };
  }

  // 輔助函數：hsl 轉 rgb
  function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  // =========================================================================
  // 易經核心數據
  // =========================================================================
  const fiveElements = {
    乾: "金",
    兌: "金",
    離: "火",
    震: "木",
    巽: "木",
    坎: "水",
    艮: "土",
    坤: "土",
  };

  // 五行色彩和諧系統
  const fiveElementsColors = {
    木: {
      primary: "#27ae60",
      secondary: "#2ecc71",
      harmony: "#3498db", // 水生木
      contrast: "#e74c3c", // 火剋木
      rgb: "39, 174, 96",
    },
    火: {
      primary: "#e74c3c",
      secondary: "#c0392b",
      harmony: "#27ae60", // 木生火
      contrast: "#3498db", // 水剋火
      rgb: "231, 76, 60",
    },
    土: {
      primary: "#f39c12",
      secondary: "#e67e22",
      harmony: "#e74c3c", // 火生土
      contrast: "#27ae60", // 木剋土
      rgb: "243, 156, 18",
    },
    金: {
      primary: "#95a5a6",
      secondary: "#7f8c8d",
      harmony: "#f39c12", // 土生金
      contrast: "#e74c3c", // 火剋金
      rgb: "149, 165, 166",
    },
    水: {
      primary: "#3498db",
      secondary: "#2980b9",
      harmony: "#95a5a6", // 金生水
      contrast: "#f39c12", // 土剋水
      rgb: "52, 152, 219",
    },
  };

  // 陰陽對比原則應用
  function applyYinYangHarmony(element, isYang = true) {
    const elementColor = fiveElementsColors[element];
    if (!elementColor) return null;

    return {
      primary: elementColor.primary,
      secondary: isYang ? elementColor.secondary : elementColor.harmony,
      accent: isYang ? elementColor.harmony : elementColor.contrast,
      balance: `linear-gradient(45deg, ${elementColor.primary} 0%, ${elementColor.harmony} 100%)`,
      yinYang: `radial-gradient(circle, ${
        isYang ? elementColor.primary : elementColor.harmony
      } 30%, ${isYang ? elementColor.harmony : elementColor.primary} 70%)`,
    };
  }

  // =========================================================================
  // 易經時間起卦系統
  // =========================================================================

  // 陽曆轉農曆（使用 lunar-javascript 庫）
  function solarToLunar(date) {
    const lunar = Lunar.fromDate(date);
    return {
      lunarYear: lunar.getYear(),
      lunarMonth: lunar.getMonth(),
      lunarDay: lunar.getDay(),
      yearBranch: lunar.getYearInGanZhi().substring(1, 2),
      timeBranch: getTimeBranch(date.getHours()),
    };
  }

  function getTimeBranch(hour) {
    const branches = [
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "巳",
      "午",
      "未",
      "申",
      "酉",
      "戌",
      "亥",
    ];
    let timeIndex;

    if (hour === 23 || hour === 0) timeIndex = 0; // 子時 (23-1點)
    else if (hour >= 1 && hour <= 2) timeIndex = 1; // 丑時
    else if (hour >= 3 && hour <= 4) timeIndex = 2; // 寅時
    else if (hour >= 5 && hour <= 6) timeIndex = 3; // 卯時
    else if (hour >= 7 && hour <= 8) timeIndex = 4; // 辰時
    else if (hour >= 9 && hour <= 10) timeIndex = 5; // 巳時
    else if (hour >= 11 && hour <= 12) timeIndex = 6; // 午時
    else if (hour >= 13 && hour <= 14) timeIndex = 7; // 未時
    else if (hour >= 15 && hour <= 16) timeIndex = 8; // 申時
    else if (hour >= 17 && hour <= 18) timeIndex = 9; // 酉時
    else if (hour >= 19 && hour <= 20) timeIndex = 10; // 戌時
    else timeIndex = 11; // 亥時

    return branches[timeIndex];
  }

  // 易經時間起卦核心邏輯
  function simulateIChing() {
    try {
      const now = new Date();

      // 轉換為農曆
      const lunarInfo = solarToLunar(now);

      // 獲取地支對應數字
      const yearBranchNum = earthlyBranchNumbers[lunarInfo.yearBranch];
      const timeBranchNum = earthlyBranchNumbers[lunarInfo.timeBranch];

      if (!yearBranchNum || !timeBranchNum) {
        throw new Error("地支數字計算錯誤");
      }

      // 傳統梅花易數起卦法
      // 1. 下卦：(年地支數 + 月數 + 日數) ÷ 8，取餘數
      const lowerGuaSum =
        yearBranchNum + lunarInfo.lunarMonth + lunarInfo.lunarDay;
      let lowerGuaRemainder = lowerGuaSum % 8;
      if (lowerGuaRemainder === 0) lowerGuaRemainder = 8;
      const lowerGua = primalBaguaMap[lowerGuaRemainder];

      // 2. 上卦：(年地支數 + 月數 + 日數 + 時地支數) ÷ 8，取餘數
      const upperGuaSum =
        yearBranchNum +
        lunarInfo.lunarMonth +
        lunarInfo.lunarDay +
        timeBranchNum;
      let upperGuaRemainder = upperGuaSum % 8;
      if (upperGuaRemainder === 0) upperGuaRemainder = 8;
      const upperGua = primalBaguaMap[upperGuaRemainder];

      // 3. 動爻：(年地支數 + 月數 + 日數 + 時地支數) ÷ 6，取餘數
      let changingLineNum = upperGuaSum % 6;
      if (changingLineNum === 0) changingLineNum = 6;

      // 查找對應的六十四卦
      const hexagramKey = upperGua + lowerGua;
      const hexagramNumber = hexagramMatrix[hexagramKey];

      if (!hexagramNumber || !iChingData[hexagramNumber]) {
        throw new Error(`無法找到對應的卦象: ${hexagramKey}`);
      }

      const hexagram = iChingData[hexagramNumber];

      return {
        hexagramNumber: hexagramNumber,
        hexagram: hexagram,
        changingLine: changingLineNum - 1, // 轉換為0-5的索引
        divination: {
          lunarDate: lunarInfo,
          upperGua: upperGua,
          lowerGua: lowerGua,
          upperGuaNum: upperGuaRemainder,
          lowerGuaNum: lowerGuaRemainder,
          changingLineNum: changingLineNum,
          calculation: {
            yearBranch: lunarInfo.yearBranch,
            yearBranchNum: yearBranchNum,
            month: lunarInfo.lunarMonth,
            day: lunarInfo.lunarDay,
            timeBranch: lunarInfo.timeBranch,
            timeBranchNum: timeBranchNum,
            upperSum: upperGuaSum,
            lowerSum: lowerGuaSum,
          },
        },
      };
    } catch (error) {
      // 如果起卦失敗，回退到隨機生成
      const hexagramNumber = Math.floor(Math.random() * 64) + 1;
      const changingLine = Math.floor(Math.random() * 6);
      const hexagram = iChingData[hexagramNumber];

      return {
        hexagramNumber: hexagramNumber,
        hexagram: hexagram,
        changingLine: changingLine,
        divination: null, // 標示為回退模式
      };
    }
  }

  // =========================================================================
  // 星座運勢 API 系統
  // =========================================================================

  // 多重 CORS 代理服務，確保 API 可用性
  async function fetchFromHoroscopeApp() {
    const apiUrl =
      "https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=pisces&day=today";

    // 多個 CORS 代理服務備選
    const corsProxies = [
      "https://corsproxy.io/?",
      "https://api.allorigins.win/get?url=",
      "https://cors-anywhere.herokuapp.com/",
      "https://proxy.cors.sh/",
    ];

    for (let i = 0; i < corsProxies.length; i++) {
      try {
        let response;
        let data;

        if (corsProxies[i].includes("allorigins")) {
          // allorigins 需要特殊處理
          response = await fetch(corsProxies[i] + encodeURIComponent(apiUrl));
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const result = await response.json();
          data = JSON.parse(result.contents);
        } else {
          // 其他代理直接返回原始數據
          response = await fetch(corsProxies[i] + encodeURIComponent(apiUrl));
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          data = await response.json();
        }

        return {
          description: data.data?.horoscope_data || "星象能量今日特別活躍",
          source: "星象智慧",
          success: true,
        };
      } catch (error) {
        if (i === corsProxies.length - 1) {
          throw new Error("所有 CORS 代理都失敗了");
        }
      }
    }
  }

  // 星座運勢獲取主函數
  async function fetchAstrology() {
    try {
      return await fetchFromHoroscopeApp();
    } catch (error) {
      // API 失敗時使用智能預測模式
      const enhancedThemes = [
        "今日雙魚座的直覺力特別敏銳，宇宙能量提醒您相信內在的聲音。適合進行創意發想和藝術創作，讓想像力帶您探索全新的靈感境界。",
        "星象顯示今天是雙魚座處理日常事務的好時機，建議早點完成工作任務，為晚上的娛樂時光做準備。與愛人計劃一次浪漫的約會或短途旅行。",
        "今日的天體配置鼓勵雙魚座專注於藝術天性的表達，是時候將腦海中醞釀已久的創意想法付諸實現，讓創造力盡情綻放。",
        "雙魚座今日適合探索內心深處的情感世界，冥想或靈性活動會帶來深刻的洞察與啟發，幫助您更了解自己的真實需求。",
        "今天的星象能量特別適合雙魚座加強人際連結，愛與理解的力量格外強大，是修復關係或深化友誼的絕佳時機。",
        "宇宙的智慧提醒雙魚座保持身心平衡，今日特別適合關注健康和自我照顧，為自己安排一些放鬆療癒的活動。",
      ];

      const randomTheme =
        enhancedThemes[Math.floor(Math.random() * enhancedThemes.length)];

      return {
        description: randomTheme,
        source: "AI 智能預測",
        success: true,
      };
    }
  }

  // =========================================================================
  // 主程序初始化
  // =========================================================================

  initialize = () => {
    const fortuneContainer = document.getElementById("fortune-content");
    if (!fortuneContainer) return;

    fortuneContainer.innerHTML = "<p>正在為您連接宇宙的智慧，請稍候...</p>";

    const iChingResult = simulateIChing();

    fetchAstrology()
      .then((astroData) => {
        const analysisHTML = generateGrandAnalysis(astroData, iChingResult);
        fortuneContainer.innerHTML = analysisHTML;
      })
      .catch((error) => {
        fortuneContainer.innerHTML =
          "<p>抱歉，系統發生未知錯誤，今日的智慧暫時迷路了。請稍後再試一次。</p>";
      });
  };

  // =========================================================================
  // 運勢分析生成系統
  // =========================================================================
  function generateGrandAnalysis(astroData, iChingResult) {
    if (!iChingResult || !iChingResult.hexagram) {
      return `<p>抱歉，今日的易經智慧暫時無法連接，請稍後再試。</p>`;
    }

    const { hexagramNumber, hexagram, changingLine, divination } = iChingResult;
    const yaoCi = hexagram.lines[changingLine];

    // 獲取詳細的爻辭解釋和意象
    const detailedExplanation = yaoDetailsExplanations[yaoCi] || null;

    const yaoCiExplanation = detailedExplanation
      ? detailedExplanation.explanation
      : "此爻辭的智慧，在於體會其文字的意境，而非固定的解釋。";

    const yaoCiImage = detailedExplanation ? detailedExplanation.image : null;

    const palaceGua = iChingPalace[hexagramNumber];
    const dailyColor = guaColors[palaceGua];
    let themeColorHex = dailyColor.hex;

    // 實施陰陽對比和五行色彩和諧原則
    const hexagramElement = fiveElements[palaceGua];
    const isYangHexagram = ["乾", "兌", "離", "震"].includes(palaceGua); // 陽卦判斷
    const fiveElementHarmony = applyYinYangHarmony(
      hexagramElement,
      isYangHexagram
    );

    // 如果有五行和諧色彩，使用五行系統，否則使用原有色彩
    if (fiveElementHarmony && hexagramElement) {
      themeColorHex = fiveElementHarmony.primary;
      // 動態主題色彩切換邏輯，支援 RGB 變數
      const adjustedThemeColor = adjustColorForContrast(
        themeColorHex,
        "#121212",
        4.5
      );
      const themeRgb = fiveElementsColors[hexagramElement].rgb;
    } else {
      // 動態主題色彩切換邏輯，支援 RGB 變數
      const adjustedThemeColor = adjustColorForContrast(
        themeColorHex,
        "#121212",
        4.5
      );
      const themeRgb = dailyColor.rgb;
    }

    // 重新定義變數以確保作用域正確
    const adjustedThemeColor = adjustColorForContrast(
      themeColorHex,
      "#121212",
      4.5
    );
    const themeRgb =
      fiveElementHarmony && hexagramElement
        ? fiveElementsColors[hexagramElement].rgb
        : dailyColor.rgb;

    // 設定主題色彩變數
    window.dailyThemeColor = adjustedThemeColor;
    document.documentElement.style.setProperty(
      "--theme-color",
      adjustedThemeColor
    );
    document.documentElement.style.setProperty("--theme-color-rgb", themeRgb);

    // 計算並設定對比色
    const contrastColor = getContrastingTextColor(adjustedThemeColor);
    document.documentElement.style.setProperty(
      "--text-on-theme",
      contrastColor
    );

    // 計算主題色亮度
    const themeBrightness =
      calculateContrastRatio("#ffffff", adjustedThemeColor) >
      calculateContrastRatio("#000000", adjustedThemeColor)
        ? 0.3
        : 0.7;
    document.documentElement.style.setProperty(
      "--theme-brightness",
      themeBrightness
    );

    // 設定玻璃質感相關變數 (使用 RGB 變數)
    document.documentElement.style.setProperty(
      "--glass-accent",
      `rgba(${themeRgb}, 0.15)`
    );

    // 設定漸變變數 (使用 RGB 變數)
    document.documentElement.style.setProperty(
      "--accent-gradient",
      `linear-gradient(135deg, var(--theme-color), rgba(${themeRgb}, 0.8))`
    );

    // 設定次要色彩
    const secondaryRgb = themeRgb
      .split(",")
      .map((n) => Math.min(255, parseInt(n.trim()) + 30))
      .join(", ");
    document.documentElement.style.setProperty(
      "--theme-secondary",
      `rgb(${secondaryRgb})`
    );

    // 設定強調色彩
    const accentRgb = themeRgb
      .split(",")
      .map((n) => Math.min(255, parseInt(n.trim()) + 50))
      .join(", ");
    document.documentElement.style.setProperty(
      "--theme-accent",
      `rgb(${accentRgb})`
    );

    // 應用五行色彩和諧原則
    if (fiveElementHarmony && hexagramElement) {
      document.documentElement.style.setProperty(
        "--five-element-primary",
        fiveElementHarmony.primary
      );
      document.documentElement.style.setProperty(
        "--five-element-secondary",
        fiveElementHarmony.secondary
      );
      document.documentElement.style.setProperty(
        "--five-element-accent",
        fiveElementHarmony.accent
      );
      document.documentElement.style.setProperty(
        "--five-element-balance",
        fiveElementHarmony.balance
      );
      document.documentElement.style.setProperty(
        "--yin-yang-harmony",
        fiveElementHarmony.yinYang
      );

      // 更新玻璃質感以配合五行色彩
      document.documentElement.style.setProperty(
        "--glass-accent",
        `rgba(${fiveElementsColors[hexagramElement].rgb}, 0.15)`
      );

      // 更新漸變以配合五行和諧
      document.documentElement.style.setProperty(
        "--accent-gradient",
        fiveElementHarmony.balance
      );
    }

    const luckyColorName = dailyColor.name;
    const luckyColorHex = adjustedThemeColor;
    const textColor = contrastColor;

    // 同步 iframe 主題
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      try {
        iframe.contentWindow.postMessage(
          {
            type: "themeUpdate",
            themeColor: adjustedThemeColor,
            themeColorRgb: themeRgb,
            glassAccent: `rgba(${themeRgb}, 0.15)`,
            contrastColor: contrastColor,
          },
          "*"
        );
      } catch (e) {
        // 跨域 iframe 無法訪問，忽略錯誤
      }
    });

    const astroTheme = astroData
      ? astroData.description
      : "今日的宇宙能量提醒我們關注內在的成長與變化。";
    const isApiFallback =
      astroData &&
      (astroData.source === "fallback" || astroData.source === "AI智能預測");

    // 生成起卦詳情
    let divinationDetails = "";
    if (divination) {
      const { lunarDate, upperGua, lowerGua, changingLineNum, calculation } =
        divination;
      divinationDetails = `
            <div class="divination-card">
                <div class="divination-header">
                    <h5>即時起卦</h5>
                </div>
                <div class="divination-content">
                    <div class="divination-row">
                        <div class="divination-label">起卦時間</div>
                        <div class="divination-value">農曆${lunarDate.lunarYear}年${lunarDate.lunarMonth}月${lunarDate.lunarDay}日 ${calculation.timeBranch}時</div>
                    </div>
                    <div class="divination-row">
                        <div class="divination-label">卦象組成</div>
                        <div class="divination-value">上${upperGua}卦 + 下${lowerGua}卦 = <strong>第${hexagramNumber}卦 ${hexagram.name}卦</strong></div>
                    </div>
                    <div class="divination-row">
                        <div class="divination-label">變爻位置</div>
                        <div class="divination-value">第${changingLineNum}爻</div>
                    </div>
                </div>
                <div class="divination-footer">
                    <span class="divination-note">※ 按照傳統梅花易數時間起卦法，以打開網頁的時間為準</span>
                </div>
            </div>`;
    } else {
      divinationDetails = `
            <div class="divination-card divination-card--fallback">
                <div class="divination-header">
                    <h5>即時起卦</h5>
                </div>
                <div class="divination-content">
                    <div class="divination-note">※ 今日使用隨機起卦方式，如需時間起卦請重新整理頁面</div>
                </div>
            </div>`;
    }

    return `
            <p style="text-align: center; color: #a0a0a0; border-bottom: 1px solid #333; padding-bottom: 15px;">
                <strong>幸運色:</strong> <span style="background-color: ${luckyColorHex}; color: ${textColor}; padding: 3px 10px; border-radius: 5px; font-weight: bold;">${luckyColorName}</span> | 
                <strong>今日卦象:</strong> ${hexagram.name}
            </p>

            <h4><strong>策略：易經的智慧箴言</strong></h4>
            <p>針對今日的能量主題，易經為您指引的策略核心，來自 <strong>${
              hexagram.name
            }卦</strong> 的第 <strong>${changingLine + 1}</strong> 爻，其爻辭為：</p>
            
            <div class="strategy-grid">
                <div class="divination-details-card">
                    ${divinationDetails}
                </div>
                
                <div class="hexagram-card">
                    <div class="hexagram-card-header">
                        <h5>六爻卦象</h5>
                    </div>
                    <div class="hexagram-card-body">
                        <div class="hexagram-display">
                            ${generateHexagramVisual(
                              hexagram.name,
                              changingLine
                            ).rows.map(row => 
                              `<div class="hexagram-row">
                                 <div class="yao-symbol">${row.symbol}</div>
                                 <div class="yao-number">${row.number}</div>
                               </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="yao-ci-card">
                    <div class="yao-ci-header">
                        <h5>爻辭箴言</h5>
                    </div>
                    <div class="yao-ci-body">
                        <p class="yao-ci">「${yaoCi}」</p>
                        ${
                          yaoCiImage
                            ? `<p class="yao-ci-image-text"><strong>《象》曰：</strong>${yaoCiImage}</p>`
                            : ""
                        }
                    </div>
                </div>
                
                <div class="yao-ci-explanation-card">
                    <div class="yao-ci-explanation-header">
                        <h5>爻辭淺釋</h5>
                    </div>
                    <div class="yao-ci-explanation-body">
                        <p>${yaoCiExplanation}</p>
                    </div>
                </div>
            </div>

            <div class="fortune-card fortune-card--advice">
                <div class="fortune-header">
                    <h4>綜合建議：今日的行動方案</h4>
                </div>
                <div class="fortune-content">
                    <div style="line-height: 1.6; white-space: pre-line;">${interpret(
                      astroTheme,
                      zwdsProfile,
                      hexagram.name,
                      yaoCi
                    )}</div>
                </div>
            </div>

            <div class="fortune-card fortune-card--theme">
                <div class="fortune-header">
                    <h4>今日主題：星象的啟示</h4>
                </div>
                <div class="fortune-content">
                    <p>${astroTheme}</p>
                </div>
            </div>

            <div class="fortune-card fortune-card--foundation">
                <div class="fortune-header">
                    <h4>根基：您的紫微斗數命盤特質</h4>
                </div>
                <div class="fortune-content">
                    <p>${zwdsProfile.analysis}</p>
                </div>
            </div>
        `;
  }

  function interpret(astroTheme, zwdsProfile, hexagramName, yaoCi) {
    // 提取星象關鍵詞進行更精準分析
    const astroKeywords = extractAstroKeywords(astroTheme);

    let advice = `<strong>宇宙能量解析</strong>\n`;
    advice += `今日星象呈現「${astroKeywords.theme}」的能量特質，這與您命盤中「${zwdsProfile.mainStars}」的核心特質形成${astroKeywords.harmony}的共振。`;

    // 易經卦象深度解析
    const hexagramInsight = getHexagramInsight(hexagramName);
    advice += `\n\n<strong>易經智慧核心</strong>\n`;
    advice += `${hexagramName}卦象徵著「${hexagramInsight.meaning}」，而今日變爻「${yaoCi}」正是這個能量場中的關鍵轉折點。`;

    // 根據爻辭內容進行多層次分析
    const yaoCiAnalysis = analyzeYaoCi(yaoCi);
    advice += `\n\n<strong>今日行動策略</strong>\n`;

    if (yaoCiAnalysis.type === "highly_auspicious") {
      advice += `<strong>大吉大利的一天！</strong> 這是宇宙為您開啟的黃金時機。\n`;
      advice += `• <strong>行動建議</strong>：大膽地推進重要計劃，您的天機星智慧與巨門星溝通力將如虎添翼。\n`;
      advice += `• <strong>人際關係</strong>：主動聯繫重要人物，今日的交流將帶來意想不到的收穫。\n`;
      advice += `• <strong>決策時機</strong>：信任您的直覺，重要決定可以在今天做出。\n`;
      advice += `• <strong>注意事項</strong>：雖然運勢極佳，但仍要保持謙遜，避免過度自信。`;
    } else if (yaoCiAnalysis.type === "auspicious") {
      advice += `<strong>順遂吉利的時光</strong> 今日的能量流動對您有利。\n`;
      advice += `• <strong>行動建議</strong>：適合進行中等規模的計劃推進，穩步前行最為合適。\n`;
      advice += `• <strong>溝通技巧</strong>：運用您巨門星的雄辯之才，但要注意語調的溫和。\n`;
      advice += `• <strong>學習成長</strong>：天機星的求知慾在今日特別旺盛，適合學習新知識。\n`;
      advice += `• <strong>財運提醒</strong>：小有進帳的可能，但不宜進行大額投資。`;
    } else if (yaoCiAnalysis.type === "challenging") {
      advice += `<strong>謹慎行事的考驗期</strong> 宇宙在考驗您的智慧與耐心。\n`;
      advice += `• <strong>行動建議</strong>：今日宜守不宜攻，將注意力轉向內在的反思與調整。\n`;
      advice += `• <strong>溝通禁忌</strong>：巨門星容易帶來口舌是非，說話前請三思而後言。\n`;
      advice += `• <strong>智慧運用</strong>：天機星的分析能力是您的護身符，凡事深思熟慮。\n`;
      advice += `• <strong>情緒管理</strong>：保持內心平靜，避免因小事而情緒波動。\n`;
      advice += `• <strong>轉機預兆</strong>：困難是成長的契機，堅持正道必有轉機。`;
    } else if (yaoCiAnalysis.type === "neutral_safe") {
      advice += `<strong>平和中正的守護期</strong> 保持現狀是最明智的選擇。\n`;
      advice += `• <strong>行動建議</strong>：專注於日常事務的完善，不求突破但求穩固。\n`;
      advice += `• <strong>心境修養</strong>：這是您INFJ特質發揮的好時機，傾聽內在聲音。\n`;
      advice += `• <strong>人際和諧</strong>：以誠待人，避免捲入爭端，和為貴。\n`;
      advice += `• <strong>自我提升</strong>：閱讀、思考、冥想都是今日的良好選擇。\n`;
      advice += `• <strong>準備期</strong>：為未來的機會做好準備，機會總是留給有準備的人。`;
    } else {
      advice += `<strong>觀察思辨的洞察期</strong> 宇宙正在向您傳遞重要訊息。\n`;
      advice += `• <strong>敏銳觀察</strong>：運用您天機星的洞察力，細心觀察環境變化。\n`;
      advice += `• <strong>深度思考</strong>：今日適合進行哲學性的思考，探索事物的本質。\n`;
      advice += `• <strong>預兆解讀</strong>：注意生活中的小細節，它們可能隱含著重要訊息。\n`;
      advice += `• <strong>耐心等待</strong>：有時候不行動也是一種行動，等待適當時機。\n`;
      advice += `• <strong>直覺培養</strong>：相信您的第六感，它會為您指引正確方向。`;
    }

    // 特殊情況的額外提醒
    const specialAdvice = getSpecialAdvice(yaoCi, hexagramName);
    if (specialAdvice) {
      advice += `\n\n<strong>特別提醒</strong>\n${specialAdvice}`;
    }

    // 結語與祝福
    advice += `\n\n<strong>今日祝福</strong>\n`;
    advice += `願您在天機星的智慧指引下，用巨門星的真誠溝通，與宇宙的節奏和諧共振，度過充實而有意義的一天。記住，每一個當下都是最好的時刻，每一次選擇都在創造您的未來。`;

    return advice;
  }

  // 輔助函數：提取星象關鍵詞
  function extractAstroKeywords(astroTheme) {
    if (!astroTheme) return { theme: "內在成長", harmony: "和諧" };

    if (astroTheme.includes("love") || astroTheme.includes("relationship")) {
      return { theme: "愛情與人際關係", harmony: "溫和" };
    } else if (astroTheme.includes("career") || astroTheme.includes("work")) {
      return { theme: "事業發展與目標", harmony: "積極" };
    } else if (astroTheme.includes("growth") || astroTheme.includes("change")) {
      return { theme: "成長與轉變", harmony: "動態" };
    } else if (
      astroTheme.includes("health") ||
      astroTheme.includes("wellness")
    ) {
      return { theme: "健康與身心平衡", harmony: "穩定" };
    } else {
      return { theme: "整體生命能量", harmony: "平衡" };
    }
  }

  // 輔助函數：獲取卦象洞察
  function getHexagramInsight(hexagramName) {
    const insights = {
      乾: { meaning: "天道剛健，創造力與領導力的象徵" },
      坤: { meaning: "地德包容，順應與承載的智慧" },
      屯: { meaning: "萬物初生，在困難中孕育希望" },
      蒙: { meaning: "啟蒙教育，智慧的開啟與成長" },
      需: { meaning: "等待時機，耐心與信心的考驗" },
      訟: { meaning: "爭議解決，溝通與妥協的藝術" },
      師: { meaning: "團隊領導，策略與紀律的運用" },
      比: { meaning: "團結合作，和諧共處的力量" },
      小畜: { meaning: "小有積蓄，積少成多的智慧" },
      履: { meaning: "品德修養，謹慎行事的重要" },
      泰: { meaning: "通泰和諧，天地交融的美好" },
      否: { meaning: "閉塞不通，轉化與突破的契機" },
      同人: { meaning: "志同道合，團結一致的力量" },
      大有: { meaning: "豐盛富足，分享與感恩的時刻" },
      謙: { meaning: "謙虛美德，低調行事的智慧" },
      豫: { meaning: "快樂享受，適度娛樂的平衡" },
      隨: { meaning: "順應變化，靈活適應的能力" },
      蠱: { meaning: "改革創新，破舊立新的勇氣" },
    };
    return insights[hexagramName] || { meaning: "變化與成長的契機" };
  }

  // 輔助函數：分析爻辭類型
  function analyzeYaoCi(yaoCi) {
    if (
      yaoCi.includes("元吉") ||
      yaoCi.includes("大吉") ||
      yaoCi.includes("亨")
    ) {
      return { type: "highly_auspicious" };
    } else if (yaoCi.includes("吉") || yaoCi.includes("利")) {
      return { type: "auspicious" };
    } else if (
      yaoCi.includes("凶") ||
      yaoCi.includes("厲") ||
      yaoCi.includes("吝")
    ) {
      return { type: "challenging" };
    } else if (yaoCi.includes("無咎") || yaoCi.includes("無悔")) {
      return { type: "neutral_safe" };
    } else {
      return { type: "observational" };
    }
  }

  // 輔助函數：獲取特殊建議
  function getSpecialAdvice(yaoCi, hexagramName) {
    if (yaoCi.includes("龍")) {
      return "龍象徵著強大的能量和潛能，今日您內在的力量正在覺醒，但要注意能量的正確使用。";
    } else if (yaoCi.includes("婚媾") || yaoCi.includes("歸妹")) {
      return "今日在感情和人際關係有特殊的能量，適合處理情感相關的事務。";
    } else if (yaoCi.includes("君子")) {
      return "今日在感情和人際關係有特殊的能量，適合處理情感相關的事務。";
    } else if (yaoCi.includes("小人")) {
      return "需要特別留意身邊的小人，保持警覺但不要過於疑心。";
    } else if (yaoCi.includes("田") || yaoCi.includes("獵")) {
      return "今日適合進行實際的行動和努力，腳踏實地會有好的收穫。";
    }
    return null;
  }

  initialize();
});
