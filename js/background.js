(function ($) {
    $(document).ready(function () {
        try {
            var secondList;

            //pick a random number as a timer   
            var random = Math.floor((Math.random() * 2600000) + 1000000);
            
            function init() {

                var localList = localStorage.getItem('firstAttempt');
                if (localList == null) {
                    getFirstAttempt();
                    chrome.browserAction.setBadgeText({text: "10"});
                }
                else {
                    getSecondAttempt();
                }

                setInterval(function () {
                    getSecondAttempt();
                }, random);
            }

            init();

            function getFirstAttempt() {
                var firstItemNames = [];
                var req = HttpRequest();
                req.onload = listof;
                req.send(null);

                function listof() {
                    if (req.readyState == 4 && req.status == 200) {
                        var rss = $.parseXML(req.responseText);
                        $(rss).find("item").each(function (index, item) {
                            firstItemNames[index] = $(item).find("title").text();
                        });
                        localStorage.setItem('firstAttempt', JSON.stringify(firstItemNames));
                    }
                }
            }

            function getSecondAttempt() {
                secondList = [];

                var req = HttpRequest();
                req.onload = listof;
                req.send(null);

                function listof() {
                    if (req.readyState == 4 && req.status == 200) {
                        var rss = $.parseXML(req.responseText);
                        $(rss).find("item").each(function (index, item) {
                            secondList[index] = $(item).find("title").text();
                        });

                        controlItems();
                    }
                }
            }

            //check the previous news and the updated news, if exist then show the number of how many new articles reveal 
            function controlItems() {
                var count = 0;
                var list = localStorage.getItem('firstAttempt'); // doing first deserialization to the local object
                var firstItemNames = JSON.parse(list);

                if (firstItemNames != null &&
                    firstItemNames.length == secondList.length) {
                    for (var i = 0; i < secondList.length; i++) {
                        for (var y = 0; y < firstItemNames.length; y++) {
                            if (secondList[i] == firstItemNames[y]) {
                                count++;
                                break;
                            }
                        }
                    }
                    //inform users for the new post(s)
                    if (count != secondList.length) {
                        result = secondList.length - count;
                        chrome.browserAction.setBadgeText({
                            text: result.toString()
                        });
                    }
                }                
                else {
                    localStorage.setItem('firstAttempt', JSON.stringify(secondList));
                }
            }

            //a simple http-Request to obtain the current feed 
            function HttpRequest() {
                var req = new XMLHttpRequest();
                var timeout = setTimeout(function () {
                    req.abort();
                }, 60000);
                req.open("GET", "http://www.kodcu.com/feed/", true);
                req.setRequestHeader("Pragma", "no-cache");
                req.setRequestHeader("Cache-Control", "no-cache");
                return req;
            }

        } catch (err) {
            console.log(err);
        }
    });
})(jQuery);