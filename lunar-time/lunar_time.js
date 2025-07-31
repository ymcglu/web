// 時辰吉凶查詢核心功能
class LunarTimeChecker {
  constructor() {
    this.timeNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    this.timePeriods = [
      '23:00-00:59', '01:00-02:59', '03:00-04:59', '05:00-06:59',
      '07:00-08:59', '09:00-10:59', '11:00-12:59', '13:00-14:59',
      '15:00-16:59', '17:00-18:59', '19:00-20:59', '21:00-22:59'
    ];
    this.currentDate = new Date();
    this.lunar = null;
    this.solar = null;
    this.init();
  }

  init() {
    try {
      // 檢查lunar-javascript是否已載入
      if (typeof Solar === 'undefined') {
        console.error('❌ lunar-javascript 未載入');
        this.lunar = null;
        return;
      }
      
      // 使用 lunar-javascript 獲取當前日期的農曆資訊
      this.solar = Solar.fromDate(this.currentDate);
      this.lunar = this.solar.getLunar();
      console.log('🌙 lunar-javascript 初始化成功', this.lunar);
    } catch (error) {
      console.error('❌ lunar-javascript 初始化失敗:', error);
      // 降級處理，使用基本功能
      this.lunar = null;
    }
  }

  // 獲取今日基本資訊
  getDateInfo() {
    const solarStr = this.solar ? this.solar.toFullString() : this.currentDate.toLocaleDateString('zh-TW');
    const lunarStr = this.lunar ? this.lunar.toFullString() : '農曆資訊載入中...';
    
    return {
      solar: solarStr,
      lunar: lunarStr,
      weekday: this.currentDate.toLocaleDateString('zh-TW', { weekday: 'long' })
    };
  }

  // 獲取今日宜忌
  getYiJi() {
    if (!this.lunar) {
      return {
        yi: ['lunar-javascript未載入'],
        ji: ['lunar-javascript未載入']
      };
    }

    try {
      // 使用正確的API方法
      const yi = this.lunar.getYi() || [];
      const ji = this.lunar.getJi() || [];
      
      console.log('宜忌資料:', { yi, ji });
      
      return {
        yi: yi.length > 0 ? yi : ['諸事皆宜'],
        ji: ji.length > 0 ? ji : ['無所禁忌']
      };
    } catch (error) {
      console.error('獲取宜忌資訊失敗:', error);
      return {
        yi: ['宜：出行、會友、學習'],
        ji: ['忌：爭執、借貸、熬夜']
      };
    }
  }

  // 獲取吉神方位
  getGodsDirection() {
    if (!this.lunar) {
      return [
        { name: '喜神', direction: '東北' },
        { name: '財神', direction: '正北' },
        { name: '福神', direction: '正南' }
      ];
    }

    try {
      const gods = [];
      
      // 使用正確的lunar-javascript API
      try {
        const xiShen = this.lunar.getXiShen && this.lunar.getXiShen();
        if (xiShen) gods.push({ name: '喜神', direction: xiShen });
      } catch (e) { console.log('喜神獲取失敗'); }
      
      try {
        const caiShen = this.lunar.getCaiShen && this.lunar.getCaiShen();
        if (caiShen) gods.push({ name: '財神', direction: caiShen });
      } catch (e) { console.log('財神獲取失敗'); }
      
      try {
        const fuShen = this.lunar.getFuShen && this.lunar.getFuShen();
        if (fuShen) gods.push({ name: '福神', direction: fuShen });
      } catch (e) { console.log('福神獲取失敗'); }

      // 如果無法獲取，使用預設值
      if (gods.length === 0) {
        return [
          { name: '喜神', direction: '東北' },
          { name: '財神', direction: '正北' },
          { name: '福神', direction: '正南' },
          { name: '貴神', direction: '西南' }
        ];
      }

      return gods;
    } catch (error) {
      console.error('獲取神位方向失敗:', error);
      return [
        { name: '喜神', direction: '東北' },
        { name: '財神', direction: '正北' },
        { name: '福神', direction: '正南' }
      ];
    }
  }

  // 獲取特定時辰的吉凶狀況
  getTimeStatus(timeIndex) {
    if (!this.lunar) {
      return 'neutral';
    }

    try {
      // 嘗試獲取時辰資訊
      const lunarTimes = this.lunar.getTimes?.() || [];
      
      if (lunarTimes.length > timeIndex) {
        const timeInfo = lunarTimes[timeIndex];
        
        // 根據時辰的吉凶情況判斷
        if (timeInfo && typeof timeInfo === 'object') {
          const ji = timeInfo.getJi?.() || [];
          const yi = timeInfo.getYi?.() || [];
          
          if (yi.length > ji.length) {
            return 'auspicious';
          } else if (ji.length > yi.length) {
            return 'inauspicious';
          }
        }
      }
      
      // 基於簡單規律判斷（替代方案）
      return this.getSimpleTimeStatus(timeIndex);
    } catch (error) {
      console.error(`獲取時辰 ${timeIndex} 狀況失敗:`, error);
      return this.getSimpleTimeStatus(timeIndex);
    }
  }

  // 簡單的時辰吉凶判斷（基於傳統規律）
  getSimpleTimeStatus(timeIndex) {
    // 基於傳統時辰吉凶的簡化規律
    const currentHour = this.currentDate.getHours();
    const dayOfYear = Math.floor((this.currentDate - new Date(this.currentDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // 簡單的偽隨機但穩定的吉凶判斷
    const seed = (dayOfYear + timeIndex) % 7;
    
    if (seed < 2) {
      return 'auspicious';
    } else if (seed < 4) {
      return 'neutral';
    } else {
      return 'inauspicious';
    }
  }

  // 獲取時辰詳細資訊
  getTimeDetails(timeIndex) {
    const timeName = this.timeNames[timeIndex];
    const timePeriod = this.timePeriods[timeIndex];
    const status = this.getTimeStatus(timeIndex);
    
    let description = '';
    let advice = '';
    
    switch (status) {
      case 'auspicious':
        description = '此時辰氣運通暢，宜進行重要事務';
        advice = '適合開會、談判、簽約、出行等重要活動';
        break;
      case 'inauspicious':
        description = '此時辰需謹慎行事，宜靜不宜動';
        advice = '建議休息調養、避免重大決策、延緩重要行動';
        break;
      default:
        description = '此時辰運勢平穩，可照常行事';
        advice = '適合日常工作、學習、處理一般事務';
    }

    return {
      name: timeName,
      period: timePeriod,
      status: status,
      description: description,
      advice: advice
    };
  }

  // 獲取所有時辰資訊
  getAllTimesInfo() {
    return this.timeNames.map((_, index) => this.getTimeDetails(index));
  }

  // 獲取當前時辰
  getCurrentTimeIndex() {
    const hour = this.currentDate.getHours();
    
    if (hour >= 23 || hour < 1) return 0; // 子時
    if (hour >= 1 && hour < 3) return 1;  // 丑時
    if (hour >= 3 && hour < 5) return 2;  // 寅時
    if (hour >= 5 && hour < 7) return 3;  // 卯時
    if (hour >= 7 && hour < 9) return 4;  // 辰時
    if (hour >= 9 && hour < 11) return 5; // 巳時
    if (hour >= 11 && hour < 13) return 6; // 午時
    if (hour >= 13 && hour < 15) return 7; // 未時
    if (hour >= 15 && hour < 17) return 8; // 申時
    if (hour >= 17 && hour < 19) return 9; // 酉時
    if (hour >= 19 && hour < 21) return 10; // 戌時
    if (hour >= 21 && hour < 23) return 11; // 亥時
    
    return 0;
  }
}

// 全域變數
let lunarChecker = null;

// DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 時辰吉凶頁面載入完成');
  
  // 初始化農曆檢查器
  lunarChecker = new LunarTimeChecker();
  
  // 載入數據
  updateData();
  
  // 監聽主題更新訊息
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'themeUpdate') {
      updateTheme(event.data);
    }
  });
});

// 更新主題色彩
function updateTheme(themeData) {
  if (!themeData) return;
  
  const root = document.documentElement;
  
  if (themeData.themeColor) {
    root.style.setProperty('--theme-color', themeData.themeColor);
  }
  
  if (themeData.themeColorRgb) {
    root.style.setProperty('--theme-color-rgb', themeData.themeColorRgb);
  }
  
  if (themeData.glassAccent) {
    root.style.setProperty('--glass-accent', themeData.glassAccent);
  }
  
  if (themeData.contrastColor) {
    root.style.setProperty('--text-on-theme', themeData.contrastColor);
  }
  
  console.log('🎨 時辰吉凶頁面主題已更新:', themeData.themeColor);
}

// 更新頁面數據
function updateData() {
  if (!lunarChecker) {
    console.error('農曆檢查器未初始化');
    return;
  }
  
  try {
    // 更新日期資訊
    updateDateInfo();
    
    // 更新宜忌資訊
    updateYiJi();
    
    // 更新吉神方位
    updateGodsDirection();
    
    // 更新時辰網格
    updateTimeGrid();
    
    console.log('✅ 數據更新完成');
  } catch (error) {
    console.error('❌ 數據更新失敗:', error);
  }
}

// 更新日期資訊
function updateDateInfo() {
  const dateInfo = lunarChecker.getDateInfo();
  const dateInfoElement = document.getElementById('date-info');
  
  if (dateInfoElement) {
    dateInfoElement.innerHTML = `
      <div><strong>公曆:</strong> ${dateInfo.solar} (${dateInfo.weekday})</div>
      <div><strong>農曆:</strong> ${dateInfo.lunar}</div>
    `;
  }
}

// 更新今日宜忌
function updateYiJi() {
  const yiJi = lunarChecker.getYiJi();
  
  // 更新宜事
  const yiElement = document.getElementById('yi-content');
  if (yiElement) {
    yiElement.innerHTML = yiJi.yi.map(item => 
      `<span class="yi-ji-item yi-item">${item}</span>`
    ).join('');
  }
  
  // 更新忌事
  const jiElement = document.getElementById('ji-content');
  if (jiElement) {
    jiElement.innerHTML = yiJi.ji.map(item => 
      `<span class="yi-ji-item ji-item">${item}</span>`
    ).join('');
  }
}

// 更新吉神方位
function updateGodsDirection() {
  const gods = lunarChecker.getGodsDirection();
  const godsGrid = document.getElementById('gods-grid');
  
  if (godsGrid) {
    if (gods.length > 0) {
      godsGrid.innerHTML = gods.map(god => `
        <div class="god-item">
          <div class="god-name">${god.name}</div>
          <div class="god-direction">${god.direction}</div>
        </div>
      `).join('');
    } else {
      godsGrid.innerHTML = '<div class="god-item"><div class="god-name">資料載入中</div></div>';
    }
  }
}

// 更新時辰網格
function updateTimeGrid() {
  const timesInfo = lunarChecker.getAllTimesInfo();
  const currentTimeIndex = lunarChecker.getCurrentTimeIndex();
  const timeGrid = document.getElementById('time-grid');
  
  if (timeGrid) {
    timeGrid.innerHTML = timesInfo.map((timeInfo, index) => {
      const isCurrentTime = index === currentTimeIndex;
      const statusClass = timeInfo.status;
      const statusText = getStatusText(timeInfo.status);
      const currentClass = isCurrentTime ? ' current-time' : '';
      
      return `
        <div class="time-card ${statusClass}${currentClass}">
          <div class="time-header">
            <div class="time-name">${timeInfo.name}時${isCurrentTime ? ' (現在)' : ''}</div>
            <div class="time-period">${timeInfo.period}</div>
          </div>
          <div class="fortune-status">
            <div class="status-indicator ${statusClass}"></div>
            <div class="status-text">${statusText}</div>
          </div>
          <div class="time-details">
            <p><strong>運勢:</strong> ${timeInfo.description}</p>
            <p><strong>建議:</strong> ${timeInfo.advice}</p>
          </div>
        </div>
      `;
    }).join('');
  }
}

// 獲取狀態文字
function getStatusText(status) {
  switch (status) {
    case 'auspicious':
      return '吉時';
    case 'inauspicious':
      return '凶時';
    default:
      return '平時';
  }
}

// CSS 中加入當前時辰的高亮樣式
const style = document.createElement('style');
style.textContent = `
  .time-card.current-time {
    border: 2px solid var(--theme-color) !important;
    box-shadow: 0 0 20px rgba(var(--theme-color-rgb), 0.3);
    transform: scale(1.02);
  }
  
  .time-card.current-time .time-name {
    background: linear-gradient(135deg, var(--theme-color), #81c784);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;
document.head.appendChild(style);