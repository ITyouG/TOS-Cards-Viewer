var u=window.u||{};u.isArray=function(o){return typeof o=='object'&&Object.prototype.toString.call(o).slice(8,-1).toLowerCase()=='array';};u.search=function(array,type,value){if(!u.isArray(array))throw new Error('第一個引數必須是陣列型別');var arr=[];arr=array.filter(function(a){return a[type].toString().indexOf(value)!=-1;});return arr;};

class CardReviewer {
    constructor() {
        this.elems = {
            parentDOM : document.querySelector('.reviewer-container'),
            buttonDOM : document.querySelector('.reviewer-switch-container'),

            // modal
            modalCameraDOM : document.querySelector('#modal-camera'),
            modalCloseBTN : document.querySelector('#modal-camera .btn-close'),
            maskDOM : document.querySelector('.rel__mask'),
        };
        this.inventoryCardsCount = {};
        this.inventoryCardsInfo = [];
        this.inventoryCards = [];
        this.searched = [];

        /*
         * 當前正在畫的分頁
         * AncientCoinSeal
         * MagicSeal
         * SpecialSeal
         * SphinxSeal
         * UltimateLord
         * Allmax
         */
        this.renderTab = [
            'ancient-coin-seal',
            'magic-seal',
            'special-seal',
            'sphinx-seal',
            'ultimate-lord-seal',
            'all-max-seal',
        ];
        this.summary = {};
        this.renderTab.forEach((e) => {
            this.summary[e] = {
                count : 0,
                seriesOwnCount : 0,
                seriesMissingCount : 0,
                ownCount : 0,
                missingCount : 0,
                dualCount : 0,
                allmaxCount : 0,
            };
        });
        this.currentRenderTab = '';

        this.run();

        let mask = document.querySelector('#loading_mask');
        if (mask) {
            mask.firstElementChild.classList.remove('show');
            mask.style.opacity = 0;
            mask.style['pointer-events'] = 'none';
        }
    }

    renderAncientCoinSeal() {
        this.currentRenderTab = 'ancient-coin-seal';
        const monsterContainer = document.createElement('div');
        monsterContainer.className = 'monsters-container';
        monsterContainer.classList.add('ancient-coin-seal');
        monsterContainer.innerHTML = `
                <div class="title">古幣封印<button class="icon-camera" data-target="ancient-coin-seal" data-html2canvas-ignore="true"><svg viewBox="0 0 30 30"><path d="M 10 5 C 9.448 5 9 5.448 9 6 L 9 7 C 9 7.552 8.552 8 8 8 L 3 8 C 2.448 8 2 8.448 2 9 L 2 24 C 2 24.552 2.448 25 3 25 L 27 25 C 27.552 25 28 24.552 28 24 L 28 9 C 28 8.448 27.552 8 27 8 L 22 8 C 21.448 8 21 7.552 21 7 L 21 6 C 21 5.448 20.552 5 20 5 L 10 5 z M 15 9 C 18.866 9 22 12.134 22 16 C 22 19.866 18.866 23 15 23 C 11.134 23 8 19.866 8 16 C 8 12.134 11.134 9 15 9 z M 25 10 C 25.552 10 26 10.448 26 11 C 26 11.552 25.552 12 25 12 C 24.448 12 24 11.552 24 11 C 24 10.448 24.448 10 25 10 z M 15 11 A 5 5 0 0 0 10 16 A 5 5 0 0 0 15 21 A 5 5 0 0 0 20 16 A 5 5 0 0 0 15 11 z"></path></svg><sup>beta</sup></button></div>
                <div class="cards-container">
                    <div class="cards">
                        <div class="part part-1">
                            <div class="main"></div>
                            <div class="extend"></div>
                        </div>
                        <div class="part part-2">
                            <div class="top-left"></div>
                            <div class="top-right"></div>
                        </div>
                        <div class="part part-3"></div>
                        <div class="part part-4">
                            <div class="top-left">
                                <h3 class="special-title">不知道怎麼分類</h3>
                                <h6 class="special-subtitle">(但是抽的到這些卡)</h6>
                            </div>
                            <div class="top-right">
                                <h3 class="special-title">偷偷放天選卡匣</h3>
                                <h6 class="special-subtitle">(古幣抽不到以下這些卡)</h6>
                            </div>
                        </div>
                    </div>
                </div>`;

        this.elems.parentDOM.appendChild(monsterContainer);

        const cards = {
            part1 : [
                1189, 1190, 1404, 1405, 1983,
            ],
            part1_extend : [
                1626, 1719, 1818, 1439, 1440,
                2081, 2149, 2207, 2305, 2380,
                2585, 2595, 0, 2480, 2584,
            ],
            part_2_left: [
                1236, 1238, 1244,
                1426, 1428, 1430,
                1452, 1454, 1460,
                1536, 1540, 1544,
                1601, 1603, 1609,
                1638, 1642, 1644,
                1925, 1927, 1929,
            ],
            part_2_right: [
                2006, 2010, 2014,
                2053, 2057, 2059,
                2218, 2220, 2222,
                2306, 2307, 2310,
                2381, 2383, 2385,
                2497, 2498, 2499,
                2567, 2568, 2570,
            ],
            part3 : [
                221, 223, 225 ,227 ,229,
                // 1166, 1168, 1170, 1172, 1174,
            ],
            part4_left : [
                1868, 1869, 1870, 1562, 2099, 2176, 2177, 0, 0,
            ],
            part4_right : [
                1919, 2586, 2587,
                2588, 2589, 2590,
            ],
        };

        const cardHandler = (cardId) => {
            if (cardId == 0) {
                fragment.appendChild(this.generateCardImageDOM(cardId, false, false));
                return;
            }
            fragment.appendChild(this.generateCardImageDOM(cardId));
        };

        let fragment = document.createDocumentFragment();
        cards.part1.forEach(cardHandler);
        monsterContainer.querySelector('.cards .part.part-1 .main').appendChild(fragment);

        fragment = document.createDocumentFragment();
        cards.part1_extend.forEach(cardHandler);
        monsterContainer.querySelector('.cards .part.part-1 .extend').appendChild(fragment);

        fragment = document.createDocumentFragment();
        cards.part_2_left.forEach(cardHandler);
        monsterContainer.querySelector('.cards .part.part-2 .top-left').appendChild(fragment);

        fragment = document.createDocumentFragment();
        cards.part_2_right.forEach(cardHandler);
        monsterContainer.querySelector('.cards .part.part-2 .top-right').appendChild(fragment);

        fragment = document.createDocumentFragment();
        cards.part3.forEach(cardHandler);
        monsterContainer.querySelector('.cards .part.part-3').appendChild(fragment);

        fragment = document.createDocumentFragment();
        cards.part4_left.forEach(cardHandler);
        monsterContainer.querySelector('.cards .part.part-4 .top-left').appendChild(fragment);

        fragment = document.createDocumentFragment();
        cards.part4_right.forEach(cardHandler);
        monsterContainer.querySelector('.cards .part.part-4 .top-right').appendChild(fragment);
    }

    renderMagicSeal() {
        this.currentRenderTab = 'magic-seal';
        const monsterContainer = document.createElement('div');
        monsterContainer.className = 'monsters-container hide';
        monsterContainer.classList.add('magic-seal');
        monsterContainer.innerHTML = `
                <div class="title">魔法石封印<button class="icon-camera" data-target="magic-seal" data-html2canvas-ignore="true"><svg viewBox="0 0 30 30"><path d="M 10 5 C 9.448 5 9 5.448 9 6 L 9 7 C 9 7.552 8.552 8 8 8 L 3 8 C 2.448 8 2 8.448 2 9 L 2 24 C 2 24.552 2.448 25 3 25 L 27 25 C 27.552 25 28 24.552 28 24 L 28 9 C 28 8.448 27.552 8 27 8 L 22 8 C 21.448 8 21 7.552 21 7 L 21 6 C 21 5.448 20.552 5 20 5 L 10 5 z M 15 9 C 18.866 9 22 12.134 22 16 C 22 19.866 18.866 23 15 23 C 11.134 23 8 19.866 8 16 C 8 12.134 11.134 9 15 9 z M 25 10 C 25.552 10 26 10.448 26 11 C 26 11.552 25.552 12 25 12 C 24.448 12 24 11.552 24 11 C 24 10.448 24.448 10 25 10 z M 15 11 A 5 5 0 0 0 10 16 A 5 5 0 0 0 15 21 A 5 5 0 0 0 20 16 A 5 5 0 0 0 15 11 z"></path></svg><sup>beta</sup></button></div>
                <div class="cards-container">
                    <div class="left"></div>
                    <div class="right"></div>
                </div>
                <div class="center"></div>
                <div class="title">獨立封印</div>
                <div class="bottom"></div>`;

        this.elems.parentDOM.appendChild(monsterContainer);

        const magicSeal = {
            special : [
                1719,
            ],
            left : [
                191,193,195,197,199,
                201,203,205,207,209,
                221,223,225,227,229,
                388,390,392,394,396,
                413,415,417,419,421,
                531,533,535,537,539,
                596,598,600,602,604,
                716,717,718,719,720,
                790,792,794,796,798,
                881,883,885,887,889,
                986,988,990,992,994,
                1136,1138,1140,1142,1144,
                1666,1667,1668,1669,1670,
                1720,1721,1722,1723,1724,
            ],
            right : [
                344,346,348,367,369,
                375,355,371,363,359,
                377,357,373,365,361,
                211,213,215,217,219,
                466,468,470,472,474,
                726,728,730,732,734,
                801,803,805,807,809,
                861,863,865,867,869,
                946,948,950,952,954,
                1031,1033,1035,1037,1039,
                1056,1058,1060,1062,1064,
                1101,1103,1105,1107,1109,
                1166,1168,1170,1172,1174,
                1221,1223,1225,1227,1229,
            ],
            center : [
                1916,1917,1918,0,0,
                0,1868,1869,1870,0,
                1811,1812,1813,1814,1815,
            ],
            bottom : [
                1240,1242,1246,1248,1250,1236,1238,1244,
                1280,1282,1284,1286,1288,1276,1278,1290,
                1416,1418,1420,1422,1424,1426,1428,1430,
                1446,1448,1450,1456,1458,1452,1454,1460,
                1471,1479,1481,1483,1485,1473,1475,1477,
                1538,1542,1546,1548,1550,1536,1540,1544,
                1605,1607,1611,1613,1615,1601,1603,1609,
                1636,1640,1646,1648,1650,1638,1642,1644,
                1675,1677,1681,1683,1685,1671,1673,1679,
                1701,1702,1706,1707,1708,1703,1704,1705,
                1846,1848,1840,1842,1850,1836,1838,1844,
                1921,1923,1931,1933,1935,1925,1929,1927,
                2008,2012,2016,2018,2020,2014,2010,2006,
                2051,2055,2061,2063,2065,2059,2057,2053,
                2129,2134,2135,2136,2133,2130,2132,2131,
                2216,2226,2228,2230,2224,2218,2220,2222,
                2308,2309,2311,2312,2313,2307,2310,2306,
                2382,2386,2384,2387,2388,2381,2385,2383,
                2496,2500,2501,2502,2503,2498,2499,2497,
                2566,2569,2571,2572,2573,2567,2568,2570,
                2636,2638,2641,2642,2643,2639,2640,2637,
            ],
        };

        const cardHandler = (cardId) => {
            if (cardId == 0) {
                fragment.appendChild(this.generateCardImageDOM(cardId, false, false));
                return;
            }
            fragment.appendChild(this.generateCardImageDOM(cardId));
        };

        let fragment = document.createDocumentFragment();
        magicSeal.left.forEach(cardHandler);
        monsterContainer.querySelector('.left').appendChild(fragment);

        fragment = document.createDocumentFragment();
        magicSeal.right.forEach(cardHandler);
        monsterContainer.querySelector('.right').appendChild(fragment);

        fragment = document.createDocumentFragment();
        magicSeal.center.forEach(cardHandler);
        monsterContainer.querySelector('.center').appendChild(fragment);

        fragment = document.createDocumentFragment();
        magicSeal.bottom.forEach(cardHandler);
        monsterContainer.querySelector('.bottom').appendChild(fragment);
    }

    renderSpecialSeal() {
        this.currentRenderTab = 'special-seal';
        const monsterContainer = document.createElement('div');
        monsterContainer.className = 'monsters-container hide';
        monsterContainer.classList.add('special-seal');
        monsterContainer.innerHTML = `
        <div class="title">合作封印<button class="icon-camera" data-target="special-seal" data-html2canvas-ignore="true"><svg viewBox="0 0 30 30"><path d="M 10 5 C 9.448 5 9 5.448 9 6 L 9 7 C 9 7.552 8.552 8 8 8 L 3 8 C 2.448 8 2 8.448 2 9 L 2 24 C 2 24.552 2.448 25 3 25 L 27 25 C 27.552 25 28 24.552 28 24 L 28 9 C 28 8.448 27.552 8 27 8 L 22 8 C 21.448 8 21 7.552 21 7 L 21 6 C 21 5.448 20.552 5 20 5 L 10 5 z M 15 9 C 18.866 9 22 12.134 22 16 C 22 19.866 18.866 23 15 23 C 11.134 23 8 19.866 8 16 C 8 12.134 11.134 9 15 9 z M 25 10 C 25.552 10 26 10.448 26 11 C 26 11.552 25.552 12 25 12 C 24.448 12 24 11.552 24 11 C 24 10.448 24.448 10 25 10 z M 15 11 A 5 5 0 0 0 10 16 A 5 5 0 0 0 15 21 A 5 5 0 0 0 20 16 A 5 5 0 0 0 15 11 z"></path></svg><sup>beta</sup></button></div>
        <div class="cards-container">
            <div class="left"></div>
            <div class="right"></div>
        </div>`;

        this.elems.parentDOM.appendChild(monsterContainer);

        const seal = {
            // Disney Seal
            '迪士尼(鬼魅奸佞)' : [
                [8001,8003,8007,8009],
                [8005,8011,8013],
            ],
            // Solomon Seal
            '七十二柱魔神' : [
                [9001,9003,9007,9009],
                [9005,9011,9013],
            ],
            // Chest of Xuan-Yuan
            '傳世神器' : [
                [748,750,752,756,758,760,766],
                [746,754,762,764],
            ],
            // Chinese Paladin Seal
            '仙劍靈傑' : [
                [897,901,905,909,911,913,915],
                [891,893,895,899,903,907],
            ],
            // MS Hero Seal
            '怪物彈珠 ‧ 英雄' : [
                [1091,1092,1093,1094,1095,1096],
                [1097],
            ],
            // Wheel of Fortune
            '大富翁' : [
                [1201,1202,1203,1204,1205],
                [1206,1207,1208],
            ],
            // Pili Heavenly Stone
            '霹靂布袋戲' : [
                [1507,1508,1511,1512,1513],
                [1506,1509,1510],
            ],
            // The Ring of Fighters
            '拳皇' : [
                [1571,1573,1574,1577,1578],
                [1572,1575,1576],
            ],
            // Digital Hatcher
            '粉碎狂熱' : [
                [1727,1730,1731,1732,1733,1734],
                [1726,1729,1728],
            ],
            // Hunter x Hunter
            '獵人' : [
                [1759,1760,1768,1769],
                [1764,1766,1762],
            ],
            // 幽☆遊☆白書
            '幽遊白書' : [
                [1788,1792,1795,1796,1797],
                [1790,1793,1786],
            ],
            // 美好世界
            '美好世界' : [
                [1884,1886,1887,1888,1889],
                [1882,1885,1883],
            ],
            // FAIRY TAIL
            'FAIRY TAIL' : [
                [1957,1959,1960,1961,1962],
                [1955,1956,1958],
            ],
            // 聖鬥士星矢
            '星辰奧義' : [
                [2103,2109,2111,2112,2113],
                [2101,2105,2107],
            ],
            // Ultraman
            '光之巨人、超人' : [
                [2155,2156,2152,2153,2159],
                [2150,2157,2154],
            ],
            // 初音ミク
            '虛擬歌手' : [
                [2187,2190,2191,2192,2193],
                [2186,2189,2188],
            ],
            // 蜘蛛×魔術師、幻影旅團
            '蜘蛛×魔術師、幻影旅團' : [
                [2283,2284,2286,2287,2288,2289],
                [2281,2282,2285],
            ],
            // 真理追尋者
            '真理追尋者' : [
                [2336,2341,2342,2340,2343],
                [2337,2339,2338],
            ],
            // 天元突破、大紅蓮團
            '天元突破、大紅蓮團' : [
                [2406,2409,2412,2410,2413],
                [2408,2411,2407,2422],
            ],
            // 七大罪
            '眾神的逆鱗' : [
                [2453,2456,2457,2458,2459],
                [2451,2452,2454],
            ],
            '新世紀福音戰士' : [
                [2519,2538,2521,2522,2523,2524],
                [2518,2536,2520,2516],
            ],
            // ROCKMAN X DIVE
            'ROCKMAN X DIVE' : [
                [2614,2615,2617,2618,2619],
                [2616,2612,2611,2620,2621],
            ],
        };

        const cardHandler = (cardId, index) => {
            if ((cardId >= 2406 && cardId < 6000 ) || cardId == 0) {
                sealCardContainer.appendChild(this.generateCardImageDOM(cardId, false, true));
            } else {
                sealCardContainer.appendChild(this.generateCardImageDOM(cardId));
            }
        };

        let sealCardContainer;
        Object.keys(seal).forEach((sealName, index, self) => {
            const targetContainer = document.createElement('div');
            targetContainer.className = `slot`;

            const title = document.createElement('h3');
            title.className = `special-title`;
            title.innerText = `${sealName}系列`;
            targetContainer.appendChild(title);

            seal[sealName].forEach((eles) => {
                sealCardContainer = document.createElement('div');
                sealCardContainer.className = `special-card-container`;
                eles.forEach(cardHandler);
                targetContainer.appendChild(sealCardContainer);
            });

            let container = monsterContainer.querySelector('.left');
            if ((index + 1) > self.length / 2) {
                container = monsterContainer.querySelector('.right');
            }
            container.appendChild(targetContainer);
        });
    }

    renderSphinxSeal() {
        this.currentRenderTab = 'sphinx-seal';
        const monsterContainer = document.createElement('div');
        monsterContainer.className = 'monsters-container hide';
        monsterContainer.classList.add('sphinx-seal');
        monsterContainer.innerHTML = `
        <div class="title">斯芬克斯<button class="icon-camera" data-target="sphinx-seal" data-html2canvas-ignore="true"><svg viewBox="0 0 30 30"><path d="M 10 5 C 9.448 5 9 5.448 9 6 L 9 7 C 9 7.552 8.552 8 8 8 L 3 8 C 2.448 8 2 8.448 2 9 L 2 24 C 2 24.552 2.448 25 3 25 L 27 25 C 27.552 25 28 24.552 28 24 L 28 9 C 28 8.448 27.552 8 27 8 L 22 8 C 21.448 8 21 7.552 21 7 L 21 6 C 21 5.448 20.552 5 20 5 L 10 5 z M 15 9 C 18.866 9 22 12.134 22 16 C 22 19.866 18.866 23 15 23 C 11.134 23 8 19.866 8 16 C 8 12.134 11.134 9 15 9 z M 25 10 C 25.552 10 26 10.448 26 11 C 26 11.552 25.552 12 25 12 C 24.448 12 24 11.552 24 11 C 24 10.448 24.448 10 25 10 z M 15 11 A 5 5 0 0 0 10 16 A 5 5 0 0 0 15 21 A 5 5 0 0 0 20 16 A 5 5 0 0 0 15 11 z"></path></svg><sup>beta</sup></button></div>
        <div class="cards-container">
            <div class="left"></div>
            <div class="right"></div>
        </div>`;

        this.elems.parentDOM.appendChild(monsterContainer);

        const seal = {
            // Disney Seal
            '迪士尼(鬼魅奸佞)' : [
                [8001,8003,8007,8009],
                [8005,8011,8013],
            ],
            // Solomon Seal
            '七十二柱魔神' : [
                [9001,9003,9007,9009],
                [9005,9011,9013],
            ],
            '遠洋的英雄' : [
                [432,434,436],
            ],
            // Chest of Xuan-Yuan
            '傳世神器' : [
                [748,750,752,756,758,760,766],
                [746,754,762,764],
            ],
            // Chinese Paladin Seal
            '仙劍靈傑' : [
                [897,901,905,909,911,913,915],
                [891,893,895,899,903,907],
            ],
            // MS Hero Seal
            '怪物彈珠 ‧ 英雄' : [
                [1091,1092,1093,1094,1095,1096],
                [1097],
            ],
            // Wheel of Fortune
            '大富翁' : [
                [1201,1202,1203,1204,1205],
                [1206,1207,1208],
            ],
            // Hunter x Hunter
            '獵人' : [
                [1759,1760,1768,1769],
                [1764,1766,1762],
            ],
        };

        const cardHandler = (cardId, index) => {
            if (cardId == 0) {
                fragment.appendChild(this.generateCardImageDOM(cardId, false, false));
                return;
            }
            sealCardContainer.appendChild(this.generateCardImageDOM(cardId));
        };

        let sealCardContainer;
        Object.keys(seal).forEach((sealName, index, self) => {
            const targetContainer = document.createElement('div');
            targetContainer.className = `slot`;

            const title = document.createElement('h3');
            title.className = `special-title`;
            title.innerText = `${sealName}系列`;
            targetContainer.appendChild(title);

            seal[sealName].forEach((eles) => {
                sealCardContainer = document.createElement('div');
                sealCardContainer.className = `special-card-container`;
                eles.forEach(cardHandler);
                targetContainer.appendChild(sealCardContainer);
            });

            let container = monsterContainer.querySelector('.left');
            if ((index + 1) > self.length / 2) {
                container = monsterContainer.querySelector('.right');
            }
            container.appendChild(targetContainer);
        });
    }

    renderUltimateLord() {
        this.currentRenderTab = 'ultimate-lord-seal';
        const monsterContainer = document.createElement('div');
        monsterContainer.className = 'monsters-container hide';
        monsterContainer.classList.add('ultimate-lord-seal');
        monsterContainer.innerHTML = `
                <div class="title">地獄魔王<button class="icon-camera" data-target="ultimate-lord-seal" data-html2canvas-ignore="true"><svg viewBox="0 0 30 30"><path d="M 10 5 C 9.448 5 9 5.448 9 6 L 9 7 C 9 7.552 8.552 8 8 8 L 3 8 C 2.448 8 2 8.448 2 9 L 2 24 C 2 24.552 2.448 25 3 25 L 27 25 C 27.552 25 28 24.552 28 24 L 28 9 C 28 8.448 27.552 8 27 8 L 22 8 C 21.448 8 21 7.552 21 7 L 21 6 C 21 5.448 20.552 5 20 5 L 10 5 z M 15 9 C 18.866 9 22 12.134 22 16 C 22 19.866 18.866 23 15 23 C 11.134 23 8 19.866 8 16 C 8 12.134 11.134 9 15 9 z M 25 10 C 25.552 10 26 10.448 26 11 C 26 11.552 25.552 12 25 12 C 24.448 12 24 11.552 24 11 C 24 10.448 24.448 10 25 10 z M 15 11 A 5 5 0 0 0 10 16 A 5 5 0 0 0 15 21 A 5 5 0 0 0 20 16 A 5 5 0 0 0 15 11 z"></path></svg><sup>beta</sup></button></div>
                <h3 style="text-align: center;">
                    官方健檢網站無部分召喚獸卡片，所以這邊沒有顯示是正常的。
                </h3>
                <h3 style="text-align: center;">
                    如果可以在健檢網站找得到卡片，在這邊卻沒有顯示，請點此<a class="contact-us" href="https://m.me/yuh926" onclick="gtag('event', 'click', {'event_category': 'Card_Review','event_label':'ultimate-concat-us'})" target="_blank">與我聯繫</a>，謝謝！
                </h3>
                <div class="sealed"></div>
                <div class="buttons">
                    <button class="btn btn-default" id="ultimate-horizontal">切換檢視方向</button>
                </div>
                <div class="cards-container horizontal">
                    <div class="attr attr_w"></div>
                    <div class="attr attr_f"></div>
                    <div class="attr attr_e"></div>
                    <div class="attr attr_l"></div>
                    <div class="attr attr_d"></div>
                </div>`;

        this.elems.parentDOM.appendChild(monsterContainer);

        const seal = {
            sealed : [
                286,288,289,287,285,
                290,293,450,829,1135,
                1871,0,0,0,0,
            ],
            attr_w : [
                542,737,878,880,937,
                1020,1098,1134,1164,1432,
                1437,1487,1498,1552,1579,
                1687,1736,1816,1852,1963,
                2389,2580,2596,2644,0,
            ],
            attr_f : [
                496,543,768,848,938,
                976,1077,1197,1253,1293,
                1433,1499,1553,1617,1652,
                1737,1853,1904,1937,2022,
                2137,8022,9016,1964,2160,
                2195,2232,2290,2301,2314,
                2029,2347,2504,2530,2574,
                2654,0,0,0,0,
            ],
            attr_e : [
                448,590,830,1100,1196,
                1213,1464,1488,1618,1653,
                1688,1711,1771,8023,8045,
                9015,1974,2067,2138,2233,
                2291,2302,2270,2390,2440,
                2575,2597,2626,2645,0,
            ],
            attr_l : [
                562,579,745,769,876,
                939,996,1049,1133,1163,
                1198,1214,1295,1298,1517,
                1654,1689,1803,1854,1938,
                1986,2023,2068,2120,2122,
                2172,2194,2234,2292,2315,
                2348,2391,2418,2478,2532,
            ],
            attr_d : [
                561,580,616,671,770,
                940,1073,1074,1132,1165,
                1252,1254,1255,1436,1518,
                1519,1523,1554,1580,1619,
                1699,1710,1745,1770,1817,
                1890,1891,1939,1965,2024,
                2069,2121,2139,2161,2162,
                2212,2346,2419,2421,2430,
                2469,2468,2470,2479,2541,
                2510,2623,0,0,0,
            ],
        };

        const cardHandler = (cardId) => {
            if (cardId == 0) {
                fragment.appendChild(this.generateCardImageDOM(cardId, false, false));
                return;
            }
            fragment.appendChild(this.generateCardImageDOM(cardId));
        };

        let fragment = document.createDocumentFragment();
        Object.keys(seal).forEach((attr) => {
            seal[attr].forEach(cardHandler);

            monsterContainer.querySelector('.' + attr).appendChild(fragment);
        });

        let ultimate_container = monsterContainer.querySelector('.cards-container');
        monsterContainer.querySelector('#ultimate-horizontal').addEventListener('click', (evt) => {
            gtag('event', 'click', {
                'event_category' : 'Cards_Reviewer',
                'event_label' : `${evt.target.id}`,
            });
            ultimate_container.classList.toggle('horizontal');
        });
    }

    renderAllmaxSeal() {
        this.currentRenderTab = 'all-max-seal';
        const monsterContainer = document.createElement('div');
        monsterContainer.className = 'monsters-container hide';
        monsterContainer.classList.add('all-max-seal');
        monsterContainer.innerHTML = `
                <div class="title">All Max<button class="icon-camera" data-target="all-max-seal" data-html2canvas-ignore="true"><svg viewBox="0 0 30 30"><path d="M 10 5 C 9.448 5 9 5.448 9 6 L 9 7 C 9 7.552 8.552 8 8 8 L 3 8 C 2.448 8 2 8.448 2 9 L 2 24 C 2 24.552 2.448 25 3 25 L 27 25 C 27.552 25 28 24.552 28 24 L 28 9 C 28 8.448 27.552 8 27 8 L 22 8 C 21.448 8 21 7.552 21 7 L 21 6 C 21 5.448 20.552 5 20 5 L 10 5 z M 15 9 C 18.866 9 22 12.134 22 16 C 22 19.866 18.866 23 15 23 C 11.134 23 8 19.866 8 16 C 8 12.134 11.134 9 15 9 z M 25 10 C 25.552 10 26 10.448 26 11 C 26 11.552 25.552 12 25 12 C 24.448 12 24 11.552 24 11 C 24 10.448 24.448 10 25 10 z M 15 11 A 5 5 0 0 0 10 16 A 5 5 0 0 0 15 21 A 5 5 0 0 0 20 16 A 5 5 0 0 0 15 11 z"></path></svg><sup>beta</sup></button></div>
                <div class="card-groups"></div>
                `;

        this.elems.parentDOM.appendChild(monsterContainer);

        const seals = {
            'width5' : {
                '北歐神' : [
                    201, 203, 205, 207, 209,
                ],
                '中國神' : [
                    221, 223, 225, 227, 229,
                ],
            },
            'width4' : {
                '希臘神' : [
                    191, 193, 195, 197, 199,
                ],
                '鮮紅恩典' : [
                    466, 468, 470, 472, 474,
                ],
                '巴比倫主神' : [
                    801, 803, 805, 807, 809,
                ],
            },
            'width3' : {
                '中國獸' : [
                    21, 25, 29, 33, 37,
                ],
                '埃及神' : [
                    211, 213, 215, 217, 219,
                ],
                '西方魔獸' : [
                    176, 179, 182, 185, 188,
                ],
            },
            'width2' : {
                '自然德魯伊' : [
                    1031, 1033, 1035, 1037, 1039,
                ],
                '異界看守者' : [
                    946, 948, 950, 952, 954,
                ],
                '聖酒女武神' : [
                    986, 988, 990, 992, 994,
                ],
                '新革童話' : [
                    881, 883, 885, 887, 889,
                ],
                '靈獸役使' : [
                    1221, 1223, 1225, 1227, 1229,
                ],
                '古希臘神' : [
                    1136,1138,1140,1142,1144,
                ],
                '魔族始源' : [
                    1101,1103,1105,1107,1109,
                ],
                '北域遺族' : [
                    1056,1058,1060,1062,1064,
                ],
                '玩具精靈' : [
                    861,863,865,867,869,
                ],
                '龍僕' : [
                    413,415,417,419,421,
                ],
                '封神演義' : [
                    531,533,535,537,539,
                ],
                '百鬼夜行' : [
                    726,728,730,732,734
                ],
                '古蹟源龍' : [
                    790,792,794,796,798
                ],
                '巫女' : [
                    344,346,348
                ],
                '十二宮' : [
                    375,355,371,367,369,377,357,373,363,359,365,361
                ],
                '機偶使者' : [
                    596,598,600,602,604
                ],
                '墮天' : [
                    1240,1242,1246,1248,1250,
                    1236,1238,1244,
                ],
                '主角' : [
                    1, 5, 9, 13, 17,
                ],
                '命運女神' : [
                    116, 119, 122, 125, 128,
                ],
                '遊俠' : [
                    131, 134, 137, 140, 143,
                ],
                '妖女' : [
                    294, 297, 300, 303, 306,
                ],
                '部落精獸' : [
                    621, 624, 627, 630, 633,
                ],
                '革新英雄' : [
                    1166, 1168, 1170, 1172, 1174,
                ],
                '誓約之花' : [
                    1189, 1190
                ],
                '三國' : [
                    1276, 1278, 1280, 1282, 1284, 1286, 1288, 1290
                ],
                '三國 ‧ 貳' : [
                    1671, 1673, 1675, 1677, 1679, 1681, 1683, 1685,
                ],
            },
            'width1' : {
                '巨像' : [
                    146, 149, 152, 155, 158,
                ],
                '異界龍' : [
                    309, 311, 313, 315, 317,
                ],
                '不死英雄' : [
                    388,390,392,394,396
                ],
                '遠洋英雄' : [
                    432, 434, 436,
                ],
                '靈殿狛犬' : [
                    980, 982, 984, 497, 499,
                ],
                '星詠之歌姬' : [
                    401, 402, 784, 786, 788,
                ],
                '劍靈' : [
                    716,717,718,719,720
                ],
                '天竺' : [
                    1666,1667,1668,1669,1670
                ],
                'BigBang元素師' : [
                    676, 678, 680, 682, 684,
                ],
                '鬼魅奸佞' : [
                    8001,8003,8007,8009,
                    8005,8011,8013,
                ],
                '七十二柱魔神' : [
                    9001,9003,9007,9009,
                    9005,9011,9013,
                ],
                '傳世神器' : [
                    748,750,752,756,758,760,766,
                    746,754,762,764,
                ],
                '仙劍靈傑' : [
                    897,901,905,909,911,913,915,
                    891,893,895,899,903,907,
                ],
                '機偶夥伴' : [
                    651, 652, 653, 654, 655,
                ],
                '怪物彈珠' : [
                    1091,1092,1093,1094,1095,1096,
                    1097,
                ],
                '大富翁' : [
                    1201,1202,1203,1204,1205,
                    1206,1207,1208,
                ],
                '霹靂布袋戲' : [
                    1507,1508,1511,1512,1513,
                    1506,1509,1510,
                ],
                '拳皇' : [
                    1571,1573,1574,1577,1578,
                    1572,1575,1576,
                ],
                '粉碎狂熱' : [
                    1727,1730,1731,1732,1733,1734,
                    1726,1729,1728,
                ],
                '獵人' : [
                    1759,1760,1768,1769,
                    1764,1766,1762,
                ],
                '幽☆遊☆白書' : [
                    1788,1792,1795,1796,1797,
                    1790,1793,1786
                ],
                '美好世界' : [
                    1884,1886,1887,1888,1889,
                    1882,1885,1883
                ],
                'FAIRY TAIL' : [
                    1957,1959,1960,1961,1962,
                    1955,1956,1958
                ],
                '星辰奧義' : [
                    2103,2109,2111,2112,2113,
                    2101,2105,2107
                ],
                '光之巨人、超人' : [
                    2155,2156,2152,2153,2159,
                    2150,2157,2154
                ],
                '聖鬥士星矢(其他)' : [
                    2114, 2115, 2124, 2120, 2122, 2123, 2125, 2117, 2118, 2121,
                ],
                'ULTRAMAN(其他)' : [
                    2169, 2162,
                ],
                '虛擬歌手' : [
                    2187,2190,2191,2192,2193,
                    2186,2189,2188,
                ],
                '蜘蛛×魔術師、幻影旅團' : [
                    2283,2284,2286,2287,2288,2289,
                    2281,2282,2285,
                ],
                '真理追尋者' : [
                    2336,2341,2342,2340,2343,
                    2337,2339,2338,
                ],
                '天元突破、大紅蓮團' : [
                    2406,2409,2412,2410,2413,
                    2408,2411,2407,
                ],
                '眾神的逆鱗' : [
                    2453,2456,2457,2458,2459,
                    2451,2452,2454,
                ],
                '新世紀福音戰士' : [
                    2519,2521,2522,2523,2524,
                    2518,2520,2516,
                ],
                'ROCKMAN X DIVE' : [
                    2614,2615,2617,2618,2619,
                    2616,2612,2611,
                ],
            }
        };

        const cardHandler = (cardId) => {
            if (searched.indexOf(cardId) != -1) {
                return;
            }

            if (CardRefines[cardId] > 0 && CardLevels[cardId] >= 99) {
                cardGroup.appendChild(this.generateCardImageDOM(cardId, false, false));
            }
            searched.push(cardId);

            let evo;
            if (Array.isArray(evoData[cardId])) {
                if (evoData[cardId].length > 1) {
                    evoData[cardId].forEach((evoCardNumber) => {
                        if (evoCardNumber < 6000) {
                            return cardHandler(evoCardNumber);
                        }
                    });
                    return;
                } else {
                    evo = evoData[cardId][0];
                }
            } else {
                evo = evoData[cardId];
            }

            if (evo) {
                return cardHandler(evo);
            }
        };

        let fragment = document.createDocumentFragment();
        let cardGroup;
        let searched = [];
        Object.keys(seals).forEach((group) => {

            Object.keys(seals[group]).forEach((key) => {
                const seriesContainer = document.createElement('div');
                seriesContainer.className = `${group}`;

                const cardGroupName = document.createElement('h3');
                searched = [];
                cardGroupName.className = 'special-title';
                cardGroupName.innerText = key;

                seriesContainer.appendChild(cardGroupName);

                seals[group][key].forEach((cardId) => {
                    cardGroup = document.createElement('div');
                    cardGroup.className = 'cards-container';
                    cardHandler(cardId);
                    fragment.appendChild(cardGroup);
                });

                seriesContainer.appendChild(fragment);

                monsterContainer.querySelector('.card-groups').appendChild(seriesContainer);
            });
        });
    }

    addButtonEvent() {
        const handler = (evt) => {
            gtag('event', 'click', {
                'event_category' : 'Switch_Tab',
                'event_label' : `${evt.target.id}`,
            });
            active_tab = evt.target.id;
            document.querySelectorAll('.monsters-container').forEach((ele) => {
                ele.classList.add('hide');
                if (ele.classList.contains(evt.target.id)) {
                    ele.classList.remove('hide');
                }
            });
        };

        document.querySelectorAll('.reviewer-switch').forEach((ele) => {
            ele.addEventListener('click', handler);
        });

        const reverseCheckHandler = (evt) => {
            gtag('event', 'click', {
                'event_category' : 'Switch_Tab',
                'event_label' : `${evt.target.id}`,
            });
            document.querySelectorAll('.monsters-container').forEach((ele) => {
                ele.classList.toggle('disable-reverse');
            });
        };

        document.querySelector('#reverse-check').addEventListener('click', reverseCheckHandler);
    }

    parseCardInfo() {
        // 取得背包資料，暫時想不到更好的做法
        // 只好暴力一點，用爬 script 內字串的方式來處理
        const self = this;
        JSON.parse(inventory_str).forEach(function (item, index) {
            // 背包編號,卡片編號,經驗值,等級,技能等級,取得時間,分解靈魂數,(不明),昇華階段,套用的SKIN編號(加上6000),技能升技百分比,技能實際CD
            // if (item.id == 2265) {
                // console.log(item);
            // }
            let temp = {
                id : parseInt(item.index),
                cardId : parseInt(item.id),
                // exp : parseInt(c[2]),
                level : parseInt(item.level),
                skLevel : parseInt(item.skillLevel),
                createdAt : parseInt(item.acquiredAt),
                // soul : parseInt(c[6]),
                // unknown : parseInt(c[7]),
                refineLevel : parseInt(item.enhanceLevel),
                // skinId : parseInt(c[9]),
                // skExp : parseInt(c[10]),
                normalSkillCd : maxCooldownTimes[parseInt(item.id)] - parseInt(item.skillLevel) + 1,
            };
            self.inventoryCards.push(temp.cardId);
            if (self.inventoryCardsInfo[temp.cardId]) {
                self.inventoryCardsInfo[temp.cardId].level = Math.max(temp.level, self.inventoryCardsInfo[temp.cardId].level);
                self.inventoryCardsInfo[temp.cardId].skLevel = Math.max(temp.skLevel, self.inventoryCardsInfo[temp.cardId].skLevel);
                self.inventoryCardsInfo[temp.cardId].refineLevel = Math.max(temp.refineLevel, self.inventoryCardsInfo[temp.cardId].refineLevel);
                self.inventoryCardsInfo[temp.cardId].normalSkillCd = Math.min(temp.normalSkillCd, self.inventoryCardsInfo[temp.cardId].normalSkillCd);
                self.inventoryCardsCount[temp.cardId] += 1;
                return;
            }
            self.inventoryCardsInfo[temp.cardId] = temp;
            self.inventoryCardsCount[temp.cardId] = 1;
        });
    }

    /**
     * cardExist 檢查卡片是否存在背包內
     *
     * @param cardId 卡片編號
     * @access public
     * @return boolean
     */
    cardExist(cardId) {
        if (this.inventoryCards.indexOf(cardId) >= 0) {
            return true;
        }
        return false;
    }

    /**
     * cardSeriesExist 遞迴檢查系列卡片是否存在背包內
     *
     * @param cardId 卡片編號
     * @access public
     * @return boolean
     */
    cardSeriesExist(cardId) {
        if (this.inventoryCards.indexOf(cardId) >= 0) {
            return true;
        }
        if (this.searched.indexOf(cardId) >= 0) {
            return false;
        }
        this.searched.push(cardId);
        if (evoData[cardId] && evoData[cardId].length > 0) {
            for (var i = 0;i < evoData[cardId].length;i++) {
                if (this.cardSeriesExist(evoData[cardId][i])) {
                    return true;
                }
            }
        }
        if (degData[cardId] && degData[cardId].length > 0) {
            for (var i = 0;i < degData[cardId].length;i++) {
                if (this.cardSeriesExist(degData[cardId][i])) {
                    return true;
                }
            }
        }
        return false;
    }

    getWikiLink(cardId) {
        return `https://tos.fandom.com/zh/wiki/${cardId}`;
    }

    generateCardImageDOM(cardId, findFinal = true, showEvoInfo = true) {
        const originCardId = cardId;
        this.searched = [];

        // 卡片詳細資訊：卡片等級、技能等級、昇華等級
        const monsterInfo = document.createElement('div');
        monsterInfo.classList.add('monster-info');

        // 取得正確的卡片編號(持有卡片且是最終型態的)
        let finalCardId;
        if (findFinal) {
            finalCardId = this.getFinalCardId(cardId);
            if (! this.inventoryCardsInfo[finalCardId]) {
                finalCardId = this.getDegCardByUserInventory(finalCardId);
            }
            if (! this.inventoryCardsInfo[finalCardId] && Array.isArray(evoData[finalCardId]) && evoData[finalCardId][1]) {
                finalCardId = evoData[finalCardId][1];
            }
        } else {
            finalCardId = originCardId;
        }

        const finalCardInfo = this.inventoryCardsInfo[finalCardId];
        if (finalCardInfo) {
            const cd = document.createElement('div');
            cd.classList.add('cd');
            cd.innerText = `CD:${finalCardInfo.normalSkillCd}`;
            monsterInfo.appendChild(cd);

            const level = document.createElement('div');
            level.classList.add('level');

            if (0 < finalCardInfo.refineLevel) {
                const refineImg = document.createElement('img');
                refineImg.classList.add('refine-lv');
                refineImg.src = `./images/tos/refine_level_${finalCardInfo.refineLevel}.png`;
                level.appendChild(refineImg);
            }
            if (finalCardInfo.level >= 99 && finalCardInfo.refineLevel >= CardRefines[finalCardId] && finalCardInfo.refineLevel != 0 && finalCardInfo.normalSkillCd == minCooldownTimes[finalCardId]) {
                this.summary[this.currentRenderTab].allmaxCount += 1;
                level.classList.add('all-max');
                level.innerHTML += `<div>All Max</div>`;
            } else if (finalCardInfo.level >= 99 && finalCardInfo.normalSkillCd == minCooldownTimes[finalCardId]) {
                this.summary[this.currentRenderTab].dualCount += 1;
                level.classList.add('dual-max');
                level.innerHTML += `<div>Dual Max</div>`;
            } else {
                level.innerHTML += `<div>Lv.${finalCardInfo.level}</div>`;
            }

            monsterInfo.appendChild(level);
            // 這邊改變要顯示的卡片圖示，有 SKIN 套用 SKIN
            const tmpCardId = finalCardInfo.skinId ? (6000 + finalCardInfo.skinId) : finalCardId;
            cardId = monsterNames[tmpCardId] ? tmpCardId : finalCardId;
        }

        // 卡片數量
        const monsterHintContainer = document.createElement('div');
        monsterHintContainer.classList = 'monster-hint hide';
        const monsterHint = document.createElement('div');
        monsterHint.classList = 'reviewer-container';
        const generateEvoInfoWithCount = cardId => {
            let str, evo;

            if (this.inventoryCardsCount[cardId]) {
                str = `<div class="count"><a class="monster-link" href="${this.getWikiLink(cardId)}" target="_blank"><img src="${monsterImages[cardId]}"></a><div>已擁有${this.inventoryCardsCount[cardId]}張</div></div>`;
            } else {
                str = `<div class="count"><a class="monster-link disable" href="${this.getWikiLink(cardId)}" target="_blank"><img src="${monsterImages[cardId]}"></a><div>已擁有0張</div></div>`;
            }

            evo = Array.isArray(evoData[cardId]) ? evoData[cardId][0] : evoData[cardId];

            if (evo) {
                return str + generateEvoInfoWithCount(evo);
            }

            return str;
        }

        if (showEvoInfo) {
            monsterHint.innerHTML = generateEvoInfoWithCount(originCardId);
            monsterHintContainer.appendChild(monsterHint);
        }

        const aDOM = document.createElement('a');
        aDOM.className = 'monster-link' + (this.inventoryCardsInfo[finalCardId] ? '' : ' disable');
        aDOM.href = `${this.getWikiLink(cardId)}`;
        aDOM.setAttribute('target', '_blank');
        aDOM.setAttribute('title', monsterNames[cardId]);
        aDOM.addEventListener('click', (e) => {
            gtag('event', 'click', {
                'event_category' : 'Cards_Reviewer',
                'event_label' : `${active_tab}:${cardId}:${monsterNames[cardId]}`,
                'value' : `${cardId}`,
            });
        });

        if (! this.cardSeriesExist(originCardId)) {
            aDOM.classList.add('disable');
            this.summary[this.currentRenderTab].seriesMissingCount += 1;
        } else {
            this.summary[this.currentRenderTab].seriesOwnCount += 1;
        }
        // 計算有沒有原始卡片，而不是進化型態
        // 意即只有一張卡片，進化上去，這邊就會算未擁有
        if (! this.cardExist(originCardId)) {
            this.summary[this.currentRenderTab].missingCount += 1;
        } else {
            this.summary[this.currentRenderTab].ownCount += 1;
        }
        this.summary[this.currentRenderTab].count += 1;
        if (0 === originCardId) {
            aDOM.classList.add('zero-card');
            this.summary[this.currentRenderTab].count -= 1;
            this.summary[this.currentRenderTab].missingCount -= 1;
            this.summary[this.currentRenderTab].seriesMissingCount -= 1;
        }

        const img = document.createElement('img');
        img.src = `${monsterImages[cardId]}`;
        img.width = 80;
        img.height = 80;
        img.setAttribute('alt', monsterNames[cardId]);

        aDOM.appendChild(img);
        aDOM.appendChild(monsterInfo);

        if (showEvoInfo) {
            aDOM.appendChild(monsterHintContainer);

            aDOM.addEventListener('mouseenter', evt => {
                monsterHintContainer.classList.remove('hide');
            });
            aDOM.addEventListener('mouseleave', evt => {
                monsterHintContainer.classList.add('hide');
            });
        }

        return aDOM;
    }

    /*
     * 取得卡片進化的最後一階段編號
     */
    getFinalCardId(cardId) {
        const evo = Array.isArray(evoData[cardId]) ? evoData[cardId][0] : evoData[cardId];
        if (evo) {
            return this.getFinalCardId(evo);
        }
        return cardId;
    }

    /*
     * 取得卡片退化型態編號，並且必須持有退化後的卡片編號
     */
    getDegCardByUserInventory(cardId) {
        const deg = Array.isArray(degData[cardId]) ? degData[cardId][0] : degData[cardId];
        if (! deg) {
            return cardId;
        }
        if (! this.inventoryCardsInfo[deg]) {
            return this.getDegCardByUserInventory(deg);
        }
        return deg;
    }

    addCameraButtonEvent () {
        const handler = (evt) => {
            this.elems.maskDOM.previousElementSibling.classList.add('show');
            this.elems.maskDOM.classList.add('show');
            const target = evt.target.closest('.icon-camera');
            this.elems.modalCloseBTN.dataset.target = target.dataset.target;

            gtag('event', 'click', {
                'event_category' : 'Cards_Reviewer',
                'event_label' : `[Camera-Open]${target.dataset.target}`,
            });

            const modalInfoDOM = this.elems.modalCameraDOM.querySelector('.modal-info');
            while (modalInfoDOM.firstChild) {
                modalInfoDOM.removeChild(modalInfoDOM.firstChild);
            }
            const subTitle = document.createElement('div');
            subTitle.innerHTML = `<h3 class="special-title" style="width: 248px;">詳細資訊</h3>`;
            modalInfoDOM.appendChild(subTitle);

            const descMap = {
                'reachRate' : '收藏率',
                'count' : '此分類卡片共',
                'seriesOwnCount' : '系列卡已擁有',
                'seriesMissingCount' : '系列卡未擁有(或無資料)',
                'ownCount' : '已擁有',
                'missingCount' : '未擁有(或無資料)',
                'dualCount' : 'Dual Max',
                'allmaxCount' : 'All Max',
            };
            const summary = this.summary[target.dataset.target];
            Object.keys(descMap).forEach((key) => {
                if (target.dataset.target == 'all-max-seal' && (key == 'seriesOwnCount' || key == 'seriesMissingCount')) {
                    return;
                }

                const DOM = document.createElement('h3');

                let content = '';
                if ('reachRate' == key) {
                    let percent = (summary['seriesOwnCount'] / summary['count']) * 100;
                    content = `${descMap[key]} <span>${percent.toFixed(2)}</span> %`;
                } else {
                    content = `${descMap[key]} <span>${summary[key]}</span> 張`;
                }
                DOM.innerHTML = content;

                modalInfoDOM.appendChild(DOM);
            });

            const self = this;
            html2canvas(document.querySelector('.bg-material'), {
                useCORS : true,
            }).then(function(canvas) {
                const cameraDisplay = document.querySelector('#modal-camera .reviewer-container .modal-display');
                while (cameraDisplay.firstChild) {
                    cameraDisplay.removeChild(cameraDisplay.firstChild);
                }

                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/png');
                cameraDisplay.appendChild(img);

                const downloadBtn = document.createElement('button');
                downloadBtn.classList.value = `btn btn-default`;
                downloadBtn.innerText = `下載圖片`;
                downloadBtn.addEventListener('click', (evt) => {
                    gtag('event', 'click', {
                        'event_category' : 'Cards_Reviewer',
                        'event_label' : `[Camera-Download]${target.dataset.target}`,
                    });
                    canvas.toBlob(function(blob) {
                        saveAs(blob, `${(new Date()).toLocaleDateString().replace(/\//g, '-')}-${document.title.replace(/- 神魔之塔卡匣檢視器/, '').trim()}-${target.dataset.target}.png`);
                    });
                });
                modalInfoDOM.appendChild(downloadBtn);

                const contactUs = document.createElement('h3');
                contactUs.innerHTML = `<h3>如果發現圖片預覽有圖片缺失的情況，請點此<a class="contact-us" href="https://m.me/yuh926" onclick="gtag('event', 'click', {'event_category': 'Card_Review','event_label':'[Camera]contact_us'})" target="_blank">告訴我</a>，謝謝！</h3>`;
                modalInfoDOM.appendChild(contactUs);

                self.elems.maskDOM.previousElementSibling.classList.remove('show');
                self.elems.modalCameraDOM.classList.add('show');
            });
        };

        document.querySelectorAll('button.icon-camera').forEach((ele) => {
            ele.addEventListener('click', handler);
        });
    }

    addCaremaModalButtonEvent() {
        const handler = (evt) => {
            gtag('event', 'click', {
                'event_category' : 'Cards_Reviewer',
                'event_label' : `[Camera-Close]${evt.target.dataset.target}`,
            });

            this.elems.maskDOM.classList.remove('show');
            this.elems.modalCameraDOM.classList.remove('show');
        }
        this.elems.modalCloseBTN.addEventListener('click', handler);
    }

    run() {
        this.parseCardInfo();
        this.renderMagicSeal();
        this.renderAncientCoinSeal();
        this.renderSpecialSeal();
        this.renderSphinxSeal();
        this.renderUltimateLord();
        this.renderAllmaxSeal();
        this.addButtonEvent();
        this.addCameraButtonEvent();
        this.addCaremaModalButtonEvent();
    }
}

gtag('event', 'click', {
    'event_category' : 'Switch_Tab',
    'event_label' : `ancient-coin-seal-default`,
});
let active_tab = 'ancient-coin-seal';