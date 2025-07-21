const path = require('path');
const db = require('./database.js');

// 資料庫檔案完整性檢查腳本
// 用於驗證所有資料檔案是否正確載入

console.log("🔍 開始檢查資料庫檔案完整性...");

// 檢查所有必要的變數是否已定義
const requiredVariables = [
    { name: 'earthlyBranchNumbers', data: db.earthlyBranchNumbers },
    { name: 'guaColors', data: db.guaColors },
    { name: 'iChingPalace', data: db.iChingPalace },
    { name: 'iChingData', data: db.iChingData },
    { name: 'yaoCiExplanations', data: db.yaoCiExplanations },
    { name: 'primalBaguaMap', data: db.primalBaguaMap },
    { name: 'hexagramMatrix', data: db.hexagramMatrix }
];

let allPassed = true;
let results = [];

requiredVariables.forEach(({ name, data }) => {
    if (data && typeof data === 'object') {
        const size = Object.keys(data).length;
        results.push(`✅ ${name} (database.js): ${size} 項目`);
    } else {
        results.push(`❌ ${name} (database.js): 未定義或格式錯誤`);
        allPassed = false;
    }
});

// 輸出檢查結果
console.log("\n📊 資料庫檔案檢查結果:");
results.forEach(result => console.log(result));

// 額外檢查：易經資料的完整性
if (db.iChingData) {
    const hexagramCount = Object.keys(db.iChingData).length;
    console.log(`\n🎯 易經資料完整性:`);
    console.log(`   - 總卦數: ${hexagramCount}/64`);
    
    if (hexagramCount === 64) {
        console.log(`   ✅ 六十四卦資料完整`);
    } else {
        console.log(`   ⚠️ 卦象資料不完整`);
        allPassed = false;
    }
}

// 最終結果
if (allPassed) {
    console.log("\n🎉 所有資料檔案檢查通過！系統可以正常運行。");
} else {
    console.log("\n⚠️ 發現問題，請檢查上述錯誤項目。");
}

// 記錄檢查時間
console.log(`\n⏰ 檢查完成時間: ${new Date().toLocaleString()}`);