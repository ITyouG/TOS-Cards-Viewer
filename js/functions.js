// 處理進化
var evoData = {};
originData.forEach((ele) => {
    const key = Object.keys(ele)[0],
        value = Object.values(ele)[0];
    if (! evoData[key]) {
        evoData[key] = [];
    }
    // iOS 10 可能會無法執行這行 ECMAScript 6
    // evoData[key] = [...new Set(evoData[key])];
    // 換個寫法
    if (-1 == evoData[key].indexOf(value)) {
        evoData[key].push(value);
    }
});

Object.keys(evoData).forEach((ele) => {
    evoData[ele].sort(function(a, b){return a-b});
});

// 處理退化
var degData = {};
Object.keys(evoData).forEach((e) => {
    evoData[e].forEach((val) => {
        if (! degData[val]) {
            degData[val] = [];
        }
        degData[val].push(e);
    });
});