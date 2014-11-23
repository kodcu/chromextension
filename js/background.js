var freshList;
var random;

$(document).ready(function () {
    //pick a random number as a timer   
    random = Math.floor((Math.random() * 2600000) + 1000000);
    init();
});

function init() {
    var localList = localStorage.getItem('POST_TITLES');
    if (!localList) {
        checkNewPosts(true);
        updateIcon(10);
    }
    else {
        checkNewPosts(false);
    }
    setInterval(function () {
        checkNewPosts(false);
    }, random);
}

function checkNewPosts(isListEmpty) {
    var req = httpRequest();
    req.onload = listof;
    req.send();

    function listof() {
        if (req.readyState == 4 && req.status == 200) {
            var data = $.parseJSON(req.responseText);

            if (isListEmpty) {
                var names = [];
                $.each(data, function (index, item) {
                    names[index] = item.post_title;
                });
                localStorage.setItem('POST_TITLES', JSON.stringify(names));
            }
            else {
                freshList = [];
                $.each(data, function (index, item) {
                    freshList[index] = item.post_title;
                });
                matchItems();
            }
        }
    }
}

//check the previous news and the updated news, if exist then show the number of how many new articles reveal 
function matchItems() {
    var count = 0;
    // doing first deserialization to the local object
    var list = localStorage.getItem('POST_TITLES');
    var localList = $.parseJSON(list);

    if (list && localList.length == freshList.length) {
        freshList.forEach(function (freshItem) {
            localList.forEach(function (localItem) {
                if (freshItem == localItem) {
                    count++;
                }
            });
        });
        //inform users for the new post(s)
        if (count != freshList.length) {
            var result = freshList.length - count;
            updateIcon(result);
        }
    }
    else {
        localStorage.setItem('POST_TITLES', JSON.stringify(freshItem));
        updateIcon(10);
    }
}

//a simple http-Request to obtain the current feed 
function httpRequest() {
    var req = new XMLHttpRequest();
    var timeout = setTimeout(function () {
        req.abort();
    }, 60000);
    req.open("GET", "http://pano.kodcu.com/chrome/posts", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Pragma", "no-cache");
    req.setRequestHeader("Cache-Control", "no-cache");
    return req;
}

chrome.omnibox.onInputEntered.addListener(function (text) {
    navigate("http://kodcu.com/?s="+text);
});

function navigate(url) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: url });
    });
}

function updateIcon(count){
    chrome.browserAction.setIcon({ path: "images/icon-r.png" });
    chrome.browserAction.setBadgeText({ text: count.toString() });
}