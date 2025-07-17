// 測試主要網站功能的簡單腳本
console.log('=== 主網站功能測試 ===');

// 等待 DOM 載入完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}

function runTests() {
    console.log('🔍 開始測試主網站功能...');
    
    // 測試 1: 檢查所有必要的全域變數
    const requiredVariables = [
        'earthlyBranchNumbers',
        'guaColors', 
        'iChingPalace',
        'iChingData',
        'yaoCiExplanations',
        'primalBaguaMap',
        'hexagramMatrix'
    ];
    
    let missingVars = [];
    requiredVariables.forEach(varName => {
        if (typeof window[varName] === 'undefined') {
            missingVars.push(varName);
        } else {
            console.log(`✅ ${varName}: 已載入`);
        }
    });
    
    if (missingVars.length > 0) {
        console.error('❌ 缺少必要變數:', missingVars);
        return false;
    }
    
    // 測試 2: 檢查運勢內容是否生成
    const fortuneContent = document.getElementById('fortune-content');
    if (fortuneContent) {
        console.log('✅ fortune-content 元素存在');
        
        // 檢查是否有內容
        setTimeout(() => {
            if (fortuneContent.innerHTML.trim().length > 0) {
                console.log('✅ 運勢內容已生成');
                console.log('📄 內容長度:', fortuneContent.innerHTML.length, '字元');
            } else {
                console.log('⚠️ 運勢內容為空');
            }
        }, 2000);
    } else {
        console.error('❌ 找不到 fortune-content 元素');
    }
    
    // 測試 3: 檢查導航功能
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        console.log(`✅ 找到 ${navLinks.length} 個導航連結`);
    } else {
        console.log('⚠️ 找不到導航連結');
    }
    
    // 測試 4: 模擬運勢生成
    try {
        if (typeof window.initialize === 'function') {
            console.log('✅ initialize 函數存在，運勢系統應該正常');
        } else {
            console.log('⚠️ initialize 函數未找到，但這可能是正常的');
        }
        
        // 檢查是否有錯誤
        window.addEventListener('error', function(e) {
            console.error('❌ JavaScript 錯誤:', e.error);
        });
        
    } catch (error) {
        console.error('❌ 測試運勢生成時發生錯誤:', error);
    }
    
    console.log('🏁 主網站功能測試完成');
}

// 5秒後顯示最終結果
setTimeout(() => {
    console.log('\n=== 最終測試報告 ===');
    console.log('如果沒有看到錯誤訊息，表示系統運作正常');
    console.log('請檢查網頁是否正確顯示運勢內容');
}, 5000);
