document.addEventListener('DOMContentLoaded', function () {
    const divinationButton = document.getElementById('divination-button');
    const realTimeDivinationButton = document.getElementById('real-time-divination-button');
    const divinationResult = document.getElementById('divination-result');

    const guaMap = {
        "1": "乾", "2": "兌", "3": "離", "4": "震",
        "5": "巽", "6": "坎", "7": "艮", "8": "坤"
    };

    function getAnimalYearNumber(year) {
        const startYear = 1924; // 甲子年
        const offset = (year - startYear) % 12;
        const animals = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        const animalMap = {"子":1, "丑":2, "寅":3, "卯":4, "辰":5, "巳":6, "午":7, "未":8, "申":9, "酉":10, "戌":11, "亥":12};
        return animalMap[animals[offset]];
    }

    function getHourNumber(hour) {
        const hourMap = {
            23: 1, 0: 1, 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 4, 7: 5, 8: 5, 9: 6, 10: 6,
            11: 7, 12: 7, 13: 8, 14: 8, 15: 9, 16: 9, 17: 10, 18: 10, 19: 11, 20: 11, 21: 12, 22: 12
        };
        return hourMap[hour];
    }

    function performDivination(year, month, day, hour, targetElement) {
        const yearNum = getAnimalYearNumber(year);

        let upperGuaNum = (yearNum + month + day) % 8;
        if (upperGuaNum === 0) upperGuaNum = 8;

        let lowerGuaNum = (yearNum + month + day + hour) % 8;
        if (lowerGuaNum === 0) lowerGuaNum = 8;

        let movingYaoNum = (yearNum + month + day + hour) % 6;
        if (movingYaoNum === 0) movingYaoNum = 6;

        const upperGuaName = guaMap[upperGuaNum];
        const lowerGuaName = guaMap[lowerGuaNum];

        const hexagramKey = `${upperGuaName}${lowerGuaName}`;
        const result = hexagramData[hexagramKey]; // hexagramData is global from hexagram-data.js
        const hexagramSymbol = hexagramUnicode[result.name];

        if (result) {
            targetElement.innerHTML = `
                <h3>${result.name} <span class="hexagram-symbol">${hexagramSymbol}</span></h3>
                <p><strong>本卦：</strong>${upperGuaName}上 ${lowerGuaName}下</p>
                <p><strong>卦辭：</strong>${result.judgment}</p>
                <p><strong>解說：</strong>${result.explanation}</p>
                <p><strong>動爻：</strong>第 ${movingYaoNum} 爻 (由下往上數)</p>
            `;
        } else {
            targetElement.innerHTML = `<p>無法找到對應的卦象，請檢查您的輸入。</p><p>(上卦: ${upperGuaName}, 下卦: ${lowerGuaName})</p>`;
        }
    }

    if (divinationButton) {
        divinationButton.addEventListener('click', function () {
            const yearInput = document.getElementById('year-input').value;
            const monthInput = document.getElementById('month-input').value;
            const dayInput = document.getElementById('day-input').value;
            const hourInput = document.getElementById('hour-input').value;

            if (!yearInput || !monthInput || !dayInput || !hourInput) {
                divinationResult.innerHTML = `<p>請輸入完整的年月日時。</p>`;
                return;
            }

            performDivination(parseInt(yearInput), parseInt(monthInput), parseInt(dayInput), parseInt(hourInput), divinationResult);
        });
    }

    if (realTimeDivinationButton) {
        realTimeDivinationButton.addEventListener('click', function () {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hour = getHourNumber(now.getHours());

            performDivination(year, month, day, hour, divinationResult);
        });
    }
});