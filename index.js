// ==UserScript==
// @name         B站原皮鉴定
// @namespace    NightSwan
// @version      0.1
// @description  B站评论区自动标注原皮
// @author       BitComing
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// ==/UserScript==

(function () {
    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=';
    let yuan = new Set();
    const yuanTag = "原神";
    const yuanName = "【数一数二的原批】";
    const dict = {
        "yuan": "<b style='color: #FF0000'>"+yuanName+"</b>",
    };
    let lst = new Set();
    const getUser = () => {
        for (let user of document.getElementsByClassName('user-name')) {
            lst.add(user);
        }
        for (let user of document.getElementsByClassName('sub-user-name')) {
            lst.add(user);
        }
        return lst;
    };
    const getPid = (user) => {
        return user.dataset['userId'];
    };
    const getTitle = (user) => {
        user.innerHTML+=dict['yuan'];
    };
    let beYuan = (user) => {
        let pid = getPid(user);
        let blogUrl = blog + pid;
        if(yuan.has(pid)) {
            return
        }
        GM_xmlhttpRequest({
            method: 'get',
            url: blogUrl,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
            },
            onload: function(res) {
                if(res.status == 200) {
                    let content = JSON.stringify(JSON.parse(res.response).data)
                    if (content.includes(yuanTag) && user.textContent.includes(yuanName) == false) {
                        yuan.add(pid)
                        getTitle(user)
                    } 
                }
            },
        });
    };

    setInterval(function() {
        let lst = getUser();
        lst.forEach(c => {
            beYuan(c);
        })
    }, 5000);

})();