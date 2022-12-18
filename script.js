// ==UserScript==
// @name         萌百恢复屏蔽词
// @namespace    https://minecreeper.top/
// @version      0.1.3
// @description  在萌娘百科将屏蔽词恢复原状
// @author       MineCreeper-矿井小帕
// @match        *://zh.moegirl.org.cn/*
// @match        *://mzh.moegirl.org.cn/*
// @grant        none
// @run-at       document-idle
// @license      GPLv3
// ==/UserScript==

(function() {
    var pgtitle = decodeURIComponent(location.pathname.substr(1)) //获取页面路径
    //if(pgtitle=="index.php"){
        //TODO: index.php获取标题
    //}
    console.log("页面标题|"+pgtitle);
    document.getElementById("firstHeading").innerText = pgtitle;
    const Http = new XMLHttpRequest();
    const url='https://zh.moegirl.org.cn/api.php?action=parse&page='+encodeURIComponent(pgtitle)+'&prop=wikitext&formatversion=2&format=json';
    Http.open("GET", url);
    if(document.getElementById("mw-content-text").innerHTML.indexOf("♯")!=-1&&pgtitle.indexOf("Category:")!=0) Http.send();
    else if(pgtitle.indexOf("Category:")==0){ //处理分类
        var lnks = document.getElementById("mw-pages").getElementsByClassName("mw-content-ltr")[0].getElementsByTagName("a");
        console.log(lnks)
        for (let i in lnks) {
            console.log()
            if(lnks[i].innerHTML.indexOf("♯")!=-1) lnks[i].innerHTML = decodeURIComponent(lnks[i].getAttribute("href").substr(1).replace("_"," "));
        }
    }
    Http.titlearg = pgtitle;
    Http.onreadystatechange = (e) => {
        var obj = JSON.parse(Http.responseText).parse.wikitext
        obj = obj.replaceAll(/\[\[([^|\]]*)\]\]/g,"[[$1|$1]]")
        obj = obj.replaceAll("|[","|[[")
        obj = obj.replaceAll(/\|([^\|\=\]]*)\=/g,"|[$1|=")
        var proctxt = ""
        var allow = true;
        for (let i in obj) {
            proctxt += obj[i]
            if(obj[i]=="[") allow = false;
            if(obj[i]=="{") allow = false;
            if(obj[i]=="|") allow = true;
            if(obj[i]=="}") allow = true;
            if(new RegExp("[\\u4E00-\\u9FFF]+", "g").test(obj[i]) && allow) proctxt += "擀蒽"
        }
        console.log(proctxt)
        proctxt = proctxt.replaceAll("|[","|")
        proctxt = proctxt.replaceAll("|=","=")
        console.log(proctxt)
        const url2='https://zh.moegirl.org.cn/api.php?action=parse&format=json&prop=text&formatversion=2';
        if(proctxt!=undefined){
            const Http2 = new XMLHttpRequest();
            Http2.open("POST", url2);
            Http2.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            Http2.send('text='+proctxt);
            Http2.onreadystatechange = (e) => {
                var htm = JSON.parse(Http2.responseText).parse.text.replaceAll("擀蒽","")
                document.getElementById("mw-content-text").innerHTML = htm
            }
        }
    }
})();
