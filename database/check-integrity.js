const fs = require('fs');
const path = require('path');

// 資料庫檔案完整性檢查腳本
// 用於驗證所有資料檔案是否正確載入

console.log("🔍 開始檢查資料庫檔案完整性...");

const databasePath = __dirname;

// 載入所有資料庫檔案
const filesToLoad = [
    'earthly-branches.js',
    'gua-colors.js',
    'iching-palaces.js',
    'iching-hexagrams.js',
    'yao-explanations.js',
    'bagua-map.js',
    'hexagram-matrix.js',
    'iching-data.js',
    'iching-lines.js'
];

filesToLoad.forEach(file => {
    try {
        const filePath = path.join(databasePath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        eval(fileContent);
    } catch (error) {
        console.error(`❌ 載入檔案 ${file} 失敗: ${error.message}`);
    }
});


// 檢查所有必要的變數是否已定義
const requiredVariables = [
    { name: 'earthlyBranchNumbers', file: 'earthly-branches.js' },
    { name: 'guaColors', file: 'gua-colors.js' },
    { name: 'iChingPalace', file: 'iching-palaces.js' },
    { name: 'iChingData', file: 'iching-hexagrams.js' },
    { name: 'yaoCiExplanations', file: 'yao-explanations.js' },
    { name: 'primalBaguaMap', file: 'bagua-map.js' },
    { name: 'hexagramMatrix', file: 'hexagram-matrix.js' }
];

let allPassed = true;
let results = [];

requiredVariables.forEach(({ name, file }) => {
    try {
        const variable = eval(name);
        if (variable && typeof variable === 'object') {
            const size = Object.keys(variable).length;
            results.push(`✅ ${name} (${file}): ${size} 項目`);
        } else {
            results.push(`❌ ${name} (${file}): 未定義或格式錯誤`);
            allPassed = false;
        }
    } catch (error) {
        results.push(`❌ ${name} (${file}): 載入失敗 - ${error.message}`);
        allPassed = false;
    }
});

// 輸出檢查結果
console.log("\n📊 資料庫檔案檢查結果:");
results.forEach(result => console.log(result));

// 額外檢查：易經資料的完整性
if (typeof iChingData !== 'undefined') {
    const hexagramCount = Object.keys(iChingData).length;
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