// ==UserScript==
// @name         萌百恢复屏蔽词
// @namespace    https://minecreeper.top/
// @version      0.1
// @description  在萌娘百科将屏蔽词恢复原状
// @author       MineCreeper-矿井小帕
// @match        *://zh.moegirl.org.cn/*
// @match        *://mzh.moegirl.org.cn/*
// @match        *://*.hmoegirl.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    var pgtitle = document.title.substr(0,document.title.length-18)
    console.log("页面标题|"+pgtitle);
    const Http = new XMLHttpRequest();
    const url='https://zh.moegirl.org.cn/api.php?action=parse&page='+encodeURIComponent(pgtitle)+'&prop=wikitext&formatversion=2&format=json';
    Http.open("GET", url);
    Http.send();
    Http.titlearg = pgtitle;
    Http.onreadystatechange = (e) => {
        var obj = JSON.parse(Http.responseText).parse.wikitext
        obj = obj.replaceAll(/\[\[([^|\]]*)\]\]/g,"[[$1|$1]]")
        var proctxt = ""
        var allow = true;
        for (let i in obj) {
            proctxt += obj[i]
            if(obj[i]=="[") allow = false;
            if(obj[i]=="{") allow = false;
            if(obj[i]=="|") allow = true;
            if(new RegExp("[\\u4E00-\\u9FFF]+", "g").test(obj[i]) && allow) proctxt += "擀蒽"
        }
        const url2='https://zh.moegirl.org.cn/api.php?action=parse&format=json&prop=text&formatversion=2';
        if(proctxt!=undefined){
            const Http2 = new XMLHttpRequest();
            Http2.open("POST", url2);
            Http2.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            Http2.send('text='+proctxt);
            Http2.onreadystatechange = (e) => {
                console.log(Http2.responseText)
                var htm = JSON.parse(Http2.responseText).parse.text.replaceAll("擀蒽","")
                document.getElementById("mw-content-text").innerHTML = htm
            }
        }
    }
    // Your code here...
})();
