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

  // 獲取祭祀適宜性分析
  getSacrificeAnalysis() {
    const yiJi = this.getYiJi();
    const sacrificeKeywords = ['祭祀', '祈福', '拜神', '祭拜', '祠堂', '上香', '燒香', '敬神', '祈願', '祈禱'];
    const tabooKeywords = ['破土', '動土', '安葬', '入殮', '移徙', '搬家'];
    
    // 檢查今日宜事中是否有祭祀相關
    const suitableForSacrifice = yiJi.yi.some(item => 
      sacrificeKeywords.some(keyword => item.includes(keyword))
    );
    
    // 檢查今日忌事中是否有祭祀相關
    const tabooForSacrifice = yiJi.ji.some(item => 
      sacrificeKeywords.some(keyword => item.includes(keyword))
    );
    
    // 檢查是否有其他不利祭祀的活動
    const hasTabooActivities = yiJi.ji.some(item => 
      tabooKeywords.some(keyword => item.includes(keyword))
    );
    
    let status = 'neutral';
    let recommendation = '';
    let details = '';
    
    if (suitableForSacrifice) {
      status = 'highly_suitable';
      recommendation = '非常適合祭祀';
      details = '今日宜祭祀祈福，是進行祭拜活動的良好時機。建議準備香燭供品，虔誠祭拜。';
    } else if (tabooForSacrifice) {
      status = 'not_suitable';
      recommendation = '不宜祭祀';
      details = '今日忌祭祀相關活動，建議擇日進行，以免衝撞神靈。';
    } else if (hasTabooActivities) {
      status = 'cautious';
      recommendation = '謹慎祭祀';
      details = '今日雖無明確祭祀禁忌，但有其他忌事，祭祀時需格外謹慎恭敬。';
    } else {
      status = 'suitable';
      recommendation = '可以祭祀';
      details = '今日平和安穩，適合進行一般性的祭祀祈福活動。';
    }
    
    return {
      status: status,
      recommendation: recommendation,
      details: details,
      suitableActivities: yiJi.yi.filter(item => 
        sacrificeKeywords.some(keyword => item.includes(keyword))
      ),
      tabooActivities: yiJi.ji.filter(item => 
        sacrificeKeywords.some(keyword => item.includes(keyword))
      )
    };
  }

  // 獲取特定時辰的祭祀適宜性
  getTimeSacrificeStatus(timeIndex) {
    const dailySacrifice = this.getSacrificeAnalysis();
    const targetTimeSlot = this.getTimeSlotFromIndex(timeIndex);
    
    // 祭祀的特殊時辰考慮
    const auspiciousHours = [6, 7, 8, 9, 10, 11]; // 辰、巳、午時較適合
    const inauspiciousHours = [23, 0, 1, 2, 3]; // 子、丑、寅時較不適合
    
    // 如果今日忌祭祀，所有時辰都不適合
    if (dailySacrifice.status === 'not_suitable') {
      return 'avoid_sacrifice';
    }
    
    // 基於時辰判斷
    if (auspiciousHours.includes(targetTimeSlot.start)) {
      if (dailySacrifice.status === 'highly_suitable') return 'perfect_for_sacrifice';
      return 'good_for_sacrifice';
    }
    
    if (inauspiciousHours.includes(targetTimeSlot.start)) {
      return 'avoid_sacrifice';
    }
    
    // 其他時辰根據日期狀況判斷
    if (dailySacrifice.status === 'highly_suitable') return 'good_for_sacrifice';
    if (dailySacrifice.status === 'suitable') return 'neutral_sacrifice';
    if (dailySacrifice.status === 'cautious') return 'cautious_sacrifice';
    
    return 'neutral_sacrifice';
  }
  
  // 輔助函數：從時辰索引獲取時間段
  getTimeSlotFromIndex(timeIndex) {
    const timeSlots = [
      {start: 23, end: 1}, {start: 1, end: 3}, {start: 3, end: 5}, {start: 5, end: 7},
      {start: 7, end: 9}, {start: 9, end: 11}, {start: 11, end: 13}, {start: 13, end: 15},
      {start: 15, end: 17}, {start: 17, end: 19}, {start: 19, end: 21}, {start: 21, end: 23}
    ];
    return timeSlots[timeIndex] || {start: 12, end: 14};
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


  // 獲取時辰詳細資訊 (只保留祭祀相關)
  getTimeDetails(timeIndex) {
    const timeName = this.timeNames[timeIndex];
    const timePeriod = this.timePeriods[timeIndex];
    const sacrificeStatus = this.getTimeSacrificeStatus(timeIndex);
    
    let sacrificeAdvice = '';
    let sacrificeDescription = '';
    
    // 祭祀專用建議和描述
    switch (sacrificeStatus) {
      case 'perfect_for_sacrifice':
        sacrificeAdvice = '🏆 祭祀最佳時辰';
        sacrificeDescription = '此時祭祀，諸神歡喜，祈願必應，是進行重要祭祀儀式的絕佳時機';
        break;
      case 'good_for_sacrifice':
        sacrificeAdvice = '✅ 適合祭祀祈福';
        sacrificeDescription = '此時辰適宜祭祀，準備香燭供品，虔誠祭拜可得神靈庇佑';
        break;
      case 'cautious_sacrifice':
        sacrificeAdvice = '⚠️ 謹慎祭祀';
        sacrificeDescription = '可進行祭祀但需格外謹慎，保持恭敬虔誠之心，避免疏忽失禮';
        break;
      case 'neutral_sacrifice':
        sacrificeAdvice = '🔘 一般祭祀時辰';
        sacrificeDescription = '普通祭祀時辰，可進行日常祭拜、上香等簡單儀式';
        break;
      case 'avoid_sacrifice':
        sacrificeAdvice = '❌ 不宜祭祀';
        sacrificeDescription = '此時不宜進行祭祀活動，建議改選其他時辰以示敬意';
        break;
      default:
        sacrificeAdvice = '🔘 可進行一般祭祀';
        sacrificeDescription = '可進行一般性的祭祀祈福活動';
    }

    return {
      name: timeName,
      period: timePeriod,
      sacrificeStatus: sacrificeStatus,
      sacrificeAdvice: sacrificeAdvice,
      sacrificeDescription: sacrificeDescription
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
    
    
    // 更新吉神方位
    updateGodsDirection();
    
    // 更新祭祀分析
    updateSacrificeAnalysis();
    
    // 更新時辰網格
    updateTimeGrid();
    
    console.log('✅ 祭祀數據更新完成');
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

// 更新祭祀分析
function updateSacrificeAnalysis() {
  const sacrificeAnalysis = lunarChecker.getSacrificeAnalysis();
  const sacrificeContent = document.getElementById('sacrifice-content');
  
  if (sacrificeContent) {
    const statusIcons = {
      'highly_suitable': '🏆',
      'suitable': '✅',
      'cautious': '⚠️',
      'not_suitable': '❌',
      'neutral': '🔘'
    };

    const icon = statusIcons[sacrificeAnalysis.status] || '🔘';
    
    let sacrificeItemsHtml = '';
    if (sacrificeAnalysis.suitableActivities.length > 0) {
      sacrificeItemsHtml += '<div class="sacrifice-info">';
      sacrificeItemsHtml += sacrificeAnalysis.suitableActivities.map(item => 
        `<span class="sacrifice-item">${item}</span>`
      ).join('');
      sacrificeItemsHtml += '</div>';
    }
    
    if (sacrificeAnalysis.tabooActivities.length > 0) {
      sacrificeItemsHtml += '<div class="sacrifice-info">';
      sacrificeItemsHtml += '<strong style="color: var(--inauspicious-color); margin-right: 8px;">忌:</strong>';
      sacrificeItemsHtml += sacrificeAnalysis.tabooActivities.map(item => 
        `<span class="sacrifice-item" style="background: rgba(244,67,54,0.1); color: var(--inauspicious-color); border-color: var(--inauspicious-color);">${item}</span>`
      ).join('');
      sacrificeItemsHtml += '</div>';
    }

    sacrificeContent.innerHTML = `
      <div class="sacrifice-status ${sacrificeAnalysis.status}">
        <span class="sacrifice-status-icon">${icon}</span>
        <span>${sacrificeAnalysis.recommendation}</span>
      </div>
      <div class="sacrifice-details">
        ${sacrificeAnalysis.details}
      </div>
      ${sacrificeItemsHtml}
    `;
  }
}

// 更新時辰網格 (只顯示祭祀相關資訊)
function updateTimeGrid() {
  const timesInfo = lunarChecker.getAllTimesInfo();
  const currentTimeIndex = lunarChecker.getCurrentTimeIndex();
  const timeGrid = document.getElementById('time-grid');
  
  if (timeGrid) {
    timeGrid.innerHTML = timesInfo.map((timeInfo, index) => {
      const isCurrentTime = index === currentTimeIndex;
      const sacrificeStatusClass = getSacrificeStatusClass(timeInfo.sacrificeStatus);
      const currentClass = isCurrentTime ? ' current-time' : '';
      
      return `
        <div class="time-card ${sacrificeStatusClass}${currentClass}">
          <div class="time-header">
            <div class="time-name">${timeInfo.name}時${isCurrentTime ? ' (現在)' : ''}</div>
            <div class="time-period">${timeInfo.period}</div>
          </div>
          <div class="sacrifice-status-display">
            <div class="status-indicator ${sacrificeStatusClass}"></div>
            <div class="status-text">${timeInfo.sacrificeAdvice}</div>
          </div>
          <div class="time-details">
            <p><strong>祭祀指導:</strong> ${timeInfo.sacrificeDescription}</p>
          </div>
        </div>
      `;
    }).join('');
  }
}

// 獲取祭祀狀態對應的CSS類名
function getSacrificeStatusClass(sacrificeStatus) {
  switch (sacrificeStatus) {
    case 'perfect_for_sacrifice':
      return 'perfect-sacrifice';
    case 'good_for_sacrifice':
      return 'good-sacrifice';
    case 'cautious_sacrifice':
      return 'cautious-sacrifice';
    case 'avoid_sacrifice':
      return 'avoid-sacrifice';
    case 'neutral_sacrifice':
    default:
      return 'neutral-sacrifice';
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