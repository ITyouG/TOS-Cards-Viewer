window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

(function() {
    const key2Link = {
        '龐貝' : 'https://tos.fandom.com/zh/wiki/1719',
        '金屬生命系列' : 'https://tos.fandom.com/zh/wiki/金屬生命',
        '獵人系列' : 'https://tos.fandom.com/zh/wiki/獵人×獵人',
        '「因果破壞‧阿撒托斯」' : 'https://tos.fandom.com/zh/wiki/1645',
        '「阿撒托斯」' : 'https://tos.fandom.com/zh/wiki/1644',
        '神魔之塔健檢中心' : 'https://checkup.tosgame.com/',
        '神魔之塔卡匣檢驗器' : 'https://chrome.google.com/webstore/detail/神魔之塔卡匣檢驗器/eegdbhnjjgdlhlhelgmakbgmooaihfib',
        '神魔之塔 繁中維基主頁' : 'https://tos.fandom.com/zh/wiki/神魔之塔_繁中維基',
    };
    Object.keys(key2Link).map((key) => {
        const link = key2Link[key];
            regex = new RegExp(key + '(?!<\/a>)', 'gmi');
        document.body.innerHTML = document.body.innerHTML.replace(regex, `<a href="${link}" class="highlight" target="_blank" data-key="${key}">${key}</a>`)
    });

    document.querySelector('#uid').addEventListener('focus', (event) => {
        event.target.value = '';
    });
    document.querySelector('#uid').addEventListener('keypress', (event) => {
        if (event.which == 13) {
            guideToBag(this.value);
        }
    });
})();

function guideToBag(uid = 0) {
    if (! uid) {
        uid = document.body.querySelector('#uid').value;
    }
    gtag('event', 'click', {
        'event_category' : 'Guide_submit',
        'event_label' : `${uid}`,
    });
    if (mobileCheck()) {
        location.href = location.href.replace('index.html', '') + `mobile.html?uid=${uid}`;
         `/mobile.html?uid=${uid}`;
    } else {
        location.href = location.href.replace('index.html', '') + `desktop.html?uid=${uid}`;
    }
}

document.querySelectorAll('a.highlight').forEach((ele) => {
    ele.addEventListener('click', (e) => {
        gtag('event', 'click', {
            'event_category' : 'Guide_highlight',
            'event_label' : `${e.target.dataset.key}`,
        });
    });
});
document.querySelectorAll('p.social a').forEach((ele) => {
    ele.addEventListener('click', (e) => {
        gtag('event', 'click', {
            'event_category' : 'Guide_social',
            'event_label' : `${e.target.dataset.key}`,
        });
    });
});
