gtag('event', 'click', {
    'event_category' : 'Switch_Tab',
    'event_label' : `ancient-coin-seal-default`,
});
const tabs = document.querySelectorAll('.footer .tab');

let active_tab = 'ancient-coin-seal';
tabs.forEach((ele) => {
    ele.addEventListener('click', (event) => {
        tabs.forEach((e) => {
            e.classList.remove('active');
        });
        document.querySelectorAll('.cards-container').forEach((e) => {
            e.classList.remove('active');
        });
        event.target.classList.add('active');
        document.querySelector(`#${event.target.dataset.target}`).classList.add('active');
        active_tab = event.target.dataset.target;

        gtag('event', 'click', {
            'event_category' : 'Switch_Tab',
            'event_label' : `${active_tab}`,
        });
    });
});

const reverseCheckHandler = (evt) => {
    gtag('event', 'click', {
        'event_category' : 'Switch_Tab',
        'event_label' : `${evt.target.id}`,
    });
    document.querySelectorAll('.cards-container').forEach((ele) => {
        ele.classList.toggle('disable-reverse');
    });
};
document.querySelector('#reverse-check').addEventListener('click', reverseCheckHandler);


class CardReviewer {
    constructor() {
        this.elems = {};
        this.inventoryCardsInfo = [];
        this.inventoryCards = [];
        this.searched = [];
        this.run();

        let mask = document.querySelector('#loading_mask');
        if (mask) {
            mask.firstElementChild.classList.remove('show');
            mask.style.opacity = 0;
            mask.style['pointer-events'] = 'none';
        }
    }

    run() {
        this.parseCardInfo();
        this.renderAncientCoinSeal();
        this.renderMagicSeal();
        this.renderSpecialSeal();
        this.renderSphinxSeal();
        this.renderUltimateLord();
    }

    parseCardInfo() {
        // 取得背包資料，暫時想不到更好的做法
        // 只好暴力一點，用爬 script 內字串的方式來處理
        const self = this;
        JSON.parse(inventory_str).forEach(function (item, index) {
            // 背包編號,卡片編號,經驗值,等級,技能等級,取得時間,分解靈魂數,(不明),昇華階段,套用的SKIN編號(加上6000),技能升技百分比,技能實際CD

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
                return;
            }
            self.inventoryCardsInfo[temp.cardId] = temp;
        });
    }

    /**
     * cardExist 遞迴檢查卡片是否存在背包內
     *
     * @param cardId 卡片編號
     * @access public
     * @return boolean
     */
    cardExist(cardId) {
        if (this.inventoryCards.indexOf(cardId) >= 0) {
            return true;
        }
        if (this.searched.indexOf(cardId) >= 0) {
            return false;
        }
        this.searched.push(cardId);
        if (evoData[cardId] && evoData[cardId].length > 0) {
            for (var i = 0;i < evoData[cardId].length;i++) {
                if (this.cardExist(evoData[cardId][i])) {
                    return true;
                }
            }
        }
        if (degData[cardId] && degData[cardId].length > 0) {
            for (var i = 0;i < degData[cardId].length;i++) {
                if (this.cardExist(degData[cardId][i])) {
                    return true;
                }
            }
        }
        return false;
    }

    getWikiLink(cardId) {
        return `https://tos.fandom.com/zh/wiki/${cardId}`;
    }

    generateCardImageDOM(cardId, findFinal = true) {
        const originCardId = cardId;
        this.searched = [];

        // 卡片詳細資訊：卡片等級、技能等級、昇華等級
        const monsterInfo = document.createElement('div');
        monsterInfo.classList.add('monster-info');

        // 取得正確的卡片編號(持有卡片且是最終型態的)
        let finalCardId = this.getFinalCardId(cardId);
        if (findFinal) {
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
                level.classList.add('all-max');
                level.innerHTML += `<div>All Max</div>`;
            } else if (finalCardInfo.level >= 99 && finalCardInfo.normalSkillCd == minCooldownTimes[finalCardId]) {
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

        const aDOM = document.createElement('a');
        aDOM.className = 'monster-link';
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

        if (! this.cardExist(originCardId)) {
            aDOM.classList.add('disable');
        }
        if (0 === originCardId) {
            aDOM.classList.add('zero-card');
        }

        const img = document.createElement('img');
        img.src = `${monsterImages[cardId]}`;
        img.width = 60;
        img.height = 60;
        img.setAttribute('alt', monsterNames[cardId]);

        aDOM.appendChild(img);
        aDOM.appendChild(monsterInfo);
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

    sealAppendToContainer (container, seal) {
        const cardHandler = (cardId) => {
            if (container.id == 'special-seal' && cardId >= 2406 && cardId < 6000) {
                sealCardContainer.appendChild(this.generateCardImageDOM(cardId, false));
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
            title.innerText = `${sealName}`;
            targetContainer.appendChild(title);

            seal[sealName].forEach((eles) => {
                sealCardContainer = document.createElement('div');
                sealCardContainer.className = `special-card-container`;
                if ('封王' === sealName) {
                    const desc = document.createElement('h6');
                    desc.className = `special-desc`;
                    desc.innerHTML = `官方健檢網站無部分召喚獸卡片，所以這邊沒有顯示是正常的。如果可以在健檢網站找得到卡片，在這邊卻沒有顯示，請點此<a href="https://m.me/yuh926" onclick="gtag('event', 'click', {'event_category': 'Card_Review','event_label':'ultimate-concat-us'})" target="_blank">與我聯繫</a>，謝謝！`;
                    sealCardContainer.appendChild(desc);
                }
                if ('偷偷放的天選卡匣' === sealName) {
                    const desc = document.createElement('h6');
                    desc.className = `special-desc`;
                    desc.innerHTML = `(古幣抽不到以下這些卡)`;
                    sealCardContainer.appendChild(desc);
                }
                eles.forEach(cardHandler);
                targetContainer.appendChild(sealCardContainer);
            });

            container.appendChild(targetContainer);
        });
    }

    renderAncientCoinSeal() {
        const monsterContainer = document.querySelector('#ancient-coin-seal');

        const seal = {
            '天竺' : [
                [1404, 1405],
            ],
            '誓約之花' : [
                [1189, 1190],
            ],
            '神話創世' : [
                [1626, 1719, 1818, 1439, 1440, 1983],
            ],
            '夢幻聖物' : [
                [2081, 2149, 2207, 2380, 2480],
            ],
            '傾世霸主' : [
                [2305],
            ],
            '機械城的守護者' : [
                [1868, 1869, 1870],
            ],
            '憶念': [
                [1562],
            ],
            '魔軍領率': [
                [2584, 2585],
            ],
            '東方戰神': [
                [2595],
            ],
            '中國神' : [
                [221, 223, 225 ,227 ,229],
            ],
            // '革新英雄' : [
            //     [1166, 1168, 1170, 1172, 1174],
            // ],
            '墮天': [
                [1236, 1238, 1244],
            ],
            // '三國': [
            //     [1276, 1278, 1290],
            // ],
            '大和': [
                [1426, 1428, 1430],
            ],
            '圓桌騎士': [
                [1452, 1454, 1460],
            ],
            // '武者烈魂': [
            //     [1473, 1475, 1477],
            // ],
            '耀脈星芒': [
                [1536, 1540, 1544],
            ],
            '妖嬈花夢': [
                [1601, 1603, 1609],
            ],
            '宇宙序章': [
                [1638, 1642, 1644],
            ],
            // '三國‧貳': [
            //     [1671, 1673, 1679],
            // ],
            // '八仙': [
            //     [1703, 1704, 1705],
            // ],
            // '印度神': [
            //     [1836, 1838, 1844],
            // ],
            '神貓大盜': [
                [1925, 1927, 1929],
            ],
            '科研敍論': [
                [2006, 2010, 2014],
            ],
            '妖魔傾城': [
                [2053, 2057, 2059],
            ],
            // '上古諸神' : [
            //     [2130, 2131, 2132],
            // ],
            '魔幻寶石' : [
                [2218, 2220, 2222],
            ],
            '遙古三族' : [
                [2306, 2307, 2310],
            ],
            '代偶規條' : [
                [2381, 2383, 2385],
            ],
            '神魔審判' : [
                [2497, 2498, 2499],
            ],
            '魔法閣沙蘿耶' : [
                [2567,2568,2570],
            ],
            '神魔天后' : [
                [2099],
            ],
            '幻變之花' : [
                [2176, 2177],
            ],
            '歡聚聖誕(抽不到)': [
                [2586,2587,2588,2589,2590],
            ],
            '偷偷放的天選卡匣': [
                [1919],
            ],
        };

        this.sealAppendToContainer(monsterContainer, seal);
    }

    renderMagicSeal() {
        const monsterContainer = document.querySelector('#magic-seal');

        const seal = {
            '希臘神' : [
                [191,193,195,197,199],
            ],
            '北歐神' : [
                [201,203,205,207,209],
            ],
            '埃及神' : [
                [211,213,215,217,219],
            ],
            '中國神' : [
                [221,223,225,227,229],
            ],
            '不死英雄' : [
                [388,390,392,394,396],
            ],
            '龍僕' : [
                [413,415,417,419,421],
            ],
            '封神演義' : [
                [531,533,535,537,539],
            ],
            '鮮紅恩典' : [
                [466,468,470,472,474],
            ],
            '機偶使者' : [
                [596,598,600,602,604],
            ],
            '劍靈' : [
                [716,717,718,719,720],
            ],
            '百鬼夜行‧惡鬼' : [
                [726,728,730,732,734],
            ],
            '古蹟源龍' : [
                [790,792,794,796,798],
            ],
            '巴比倫主神' : [
                [801,803,805,807,809],
            ],
            '巫女' : [
                [344,346,348],
            ],
            '黃道十二宮' : [
                [375,355,371,367,369,377,357,373,363,359,365,361],
            ],
            '玩具精靈' : [
                [861,863,865,867,869],
            ],
            '新革童話' : [
                [881,883,885,887,889],
            ],
            '諸界看守者' : [
                [946,948,950,952,954],
            ],
            '聖酒女武神' : [
                [986,988,990,992,994],
            ],
            '自然德魯依' : [
                [1031,1033,1035,1037,1039],
            ],
            '北域遺族' : [
                [1056,1058,1060,1062,1064],
            ],
            '魔族始源' : [
                [1101,1103,1105,1107,1109],
            ],
            '古希臘神' : [
                [1136,1138,1140,1142,1144],
            ],
            '革新英雄' : [
                [1166,1168,1170,1172,1174],
            ],
            '靈獸役使' : [
                [1221,1223,1225,1227,1229],
            ],
            '天竺' : [
                [1666,1667,1668,1669,1670],
            ],
            '金屬生命' : [
                [1720,1721,1722,1723,1724],
            ],
            '墮天' : [
                [1240,1242,1246,1248,1250],
                [1236,1238,1244],
            ],
            '三國' : [
                [1280,1282,1284,1286,1288],
                [1276,1278,1290],
            ],
            '大和' : [
                [1416,1418,1420,1422,1424],
                [1426,1428,1430],
            ],
            '圓桌騎士' : [
                [1446,1448,1450,1456,1458],
                [1452,1454,1460],
            ],
            '武者烈魂' : [
                [1471,1479,1481,1483,1485],
                [1473,1475,1477],
            ],
            '耀脈星芒' : [
                [1538,1542,1546,1548,1550],
                [1536,1540,1544],
            ],
            '妖嬈花夢' : [
                [1605,1607,1611,1613,1615],
                [1601,1603,1609],
            ],
            '宇宙序章' : [
                [1636,1640,1646,1648,1650],
                [1638,1642,1644],
            ],
            '三國‧貳' : [
                [1675,1677,1681,1683,1685],
                [1671,1673,1679],
            ],
            '八仙' : [
                [1701,1702,1706,1707,1708],
                [1703,1704,1705],
            ],
            '印度神' : [
                [1846,1848,1840,1842,1850],
                [1836,1838,1844],
            ],
            '神貓大盜' : [
                [1921,1923,1931,1933,1935],
                [1925,1929,1927],
            ],
            '科研敘論' : [
                [2008,2012,2016,2018,2020],
                [2014,2010,2006],
            ],
            '妖魔傾城' : [
                [2051,2055,2061,2063,2065],
                [2059,2057,2053],
            ],
            '上古諸神' : [
                [2129,2134,2135,2136,2133],
                [2130,2132,2131],
            ],
            '魔幻寶石' : [
                [2216,2226,2228,2230,2224],
                [2218,2220,2222],
            ],
            '遙古三族' : [
                [2308,2309,2311,2312,2313],
                [2307,2310,2306],
            ],
            '代偶規條' : [
                [2382,2386,2384,2387,2388],
                [2381,2385,2383],
            ],
            '神魔審判' : [
                [2496,2500,2501,2502,2503],
                [2498,2499,2497],
            ],
            '魔法閣沙蘿耶' : [
                [2566,2569,2571,2572,2573],
                [2567,2568,2570],
            ],
            '次元英雄' : [
                [2636,2638,2641,2642,2643],
                [2639,2640,2637],
            ],
            '埃及皇權' : [
                [1916,1917,1918],
            ],
            '機械城的守護者' : [
                [1868,1869,1870],
            ],
            '魔族賢者' : [
                [1811,1812,1813,1814,1815],
            ],
        };

        this.sealAppendToContainer(monsterContainer, seal);
    }

    renderSpecialSeal() {
        const monsterContainer = document.querySelector('#special-seal');
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
                [2103,2109,2111,2112,2113,],
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
            // EVA
            '新世紀福音戰士' : [
                [2519,2538,2521,2522,2523,2524],
                [2518,2536,2520,2516],
            ],
            // 洛克人
            'ROCKMAN X DIVE' : [
                [2614,2615,2617,2618,2619],
                [2616,2612,2611,2620,2621],
            ],
        };

        this.sealAppendToContainer(monsterContainer, seal);
    }

    renderSphinxSeal() {
        const monsterContainer = document.querySelector('#sphinx-seal');
        const seal = {
            '迪士尼(鬼魅奸佞)' : [
                [8001,8003,8007,8009],
                [8005,8011,8013],
            ],
            '七十二柱魔神' : [
                [9001,9003,9007,9009],
                [9005,9011,9013],
            ],
            '遠洋的英雄' : [
                [432,434,436],
            ],
            '傳世神器' : [
                [748,750,752,756,758,760,766],
                [746,754,762,764],
            ],
            '仙劍靈傑' : [
                [897,901,905,909,911,913,915],
                [891,893,895,899,903,907],
            ],
            '怪物彈珠 ‧ 英雄' : [
                [1091,1092,1093,1094,1095,1096],
                [1097],
            ],
            '大富翁' : [
                [1201,1202,1203,1204,1205],
                [1206,1207,1208],
            ],
            '獵人' : [
                [1759,1760,1768,1769],
                [1764,1766,1762],
            ],
        };

        this.sealAppendToContainer(monsterContainer, seal);
    }

    renderUltimateLord() {
        const monsterContainer = document.querySelector('#ultimate-lord-seal');

        const seal = {
            '封王' : [
                [
                    286,288,289,287,285,
                    290,293,450,829,1135,
                    1871,
                ],
            ],
            '地獄魔王 (水)' : [
                [
                    542,737,878,880,937,
                    1020,1098,1134,1164,1432,
                    1437,1487,1498,1552,1579,
                    1687,1736,1816,1852,1963,
                    2389,2580,2596,2644,
                ],
            ],
            '地獄魔王 (火)' : [
                [
                    496,543,768,848,938,
                    976,1077,1197,1253,1293,
                    1433,1499,1553,1617,1652,
                    1737,1853,1904,1937,2022,
                    2137,8022,9016,1964,2160,
                    2195,2232,2290,2301,2314,
                    2029,2347,2504,2530,2574,
                    2654,
                ],
            ],
            '地獄魔王 (木)' : [
                [
                    448,590,830,1100,1196,
                    1213,1464,1488,1618,1653,
                    1688,1711,1771,8023,8045,
                    9015,1974,2067,2138,2233,
                    2291,2302,2270,2390,2440,
                    2575,2597,2626,2645,
                ],
            ],
            '地獄魔王 (光)' : [
                [
                    562,579,745,769,876,
                    939,996,1049,1133,1163,
                    1198,1214,1295,1298,1517,
                    1654,1689,1803,1854,1938,
                    1986,2023,2068,2120,2122,
                    2172,2194,2234,2292,2315,
                    2348,2391,2418,2478,2532,
                ],
            ],
            '地獄魔王 (暗)' : [
                [
                    561,580,616,671,770,
                    940,1073,1074,1132,1165,
                    1252,1254,1255,1436,1518,
                    1519,1523,1554,1580,1619,
                    1699,1710,1745,1770,1817,
                    1890,1891,1939,1965,2024,
                    2069,2121,2139,2161,2162,
                    2212,2346,2419,2421,2430,
                    2469,2468,2470,2479,2541,
                    2510,2623,
                ],
            ],
        };

        this.sealAppendToContainer(monsterContainer, seal);
    }
}

/*
 * footer 捲動小動畫
 */
const EasingFunctions = {
    easeInCubic : (t) => { return t*t*t; },
    easeInOutQuint: (t) => { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
}
function footerTabAnimate()
{
    const f = document.querySelector('.footer');
    let direct = true;
    let x = 0;
    var id = setInterval(() => {
        if (direct) {
            x++;
        } else {
            x--;
        }
        f.scrollTop = EasingFunctions.easeInCubic(x / 100);
        if (direct) {
            direct = ! ((f.scrollTop + f.offsetHeight) >= f.scrollHeight);
        } else {
            direct = (f.scrollTop == 0);
        }
    }, 10) // draw every 10ms

    let is_send = false;
    f.addEventListener('touchstart', (evt) => {
        if (! is_send) {
            is_send = true;
            gtag('event', 'touchstart', {
                'event_category' : 'Switch_Tab',
                'event_label' : `stop-tab-animate`,
            });
        }
        result = clearInterval(id);
    });
}
footerTabAnimate();
