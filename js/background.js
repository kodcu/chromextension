(function ($) {
    $(document).ready(function () {
        try {
            var firstItemNames, secondItemNames;            
            //pick a random number as a timer   
            var random = Math.floor((Math.random() * 2600000) + 1000000);

            if (!localStorage.isInitialized) {
                localStorage.isActivated = true;
                localStorage.isCountChange = false;
            }

            function init() {
                if (JSON.parse(localStorage.isActivated)) { getFirstAttempt(); }

                setInterval(function () {
                    if (JSON.parse(localStorage.isActivated)) {
                        if (JSON.parse(localStorage.isCountChange)) {
                            getFirstAttempt();
                            localStorage.isCountChange = false;
                        }
                        getSecondAttempt();
                    }
                }, random);
            }
            init();

            function getFirstAttempt() {
                firstItemNames = [];

                var req = HttpRequest();
                req.onload = listof;
                req.send(null);

                function listof() {
                    if (req.readyState == 4 && req.status == 200) {
                        var rss = $.parseXML(req.responseText);
                        $(rss).find("item").each(function (index, item) {
                            firstItemNames[index] = $(item).find("title").text();
                        });
                    }
                }
            }

            function getSecondAttempt() {
                secondItemNames = [];

                var req = HttpRequest();
                req.onload = listof;
                req.send(null);

                function listof() {
                    if (req.readyState == 4 && req.status == 200) {
                        var rss = $.parseXML(req.responseText);
                        $(rss).find("item").each(function (index, item) {
                            secondItemNames[index] = $(item).find("title").text();
                        });
                        controlItems();
                    }
                }
            }

            function controlItems() {
                var count = 0;
                if (JSON.parse(localStorage.isCountChange) == false &&
                firstItemNames.length == secondItemNames.length) {

                    for (var i = 0; i < secondItemNames.length; i++) {
                        for (var y = 0; y < firstItemNames.length; y++) {
                            if (secondItemNames[i] == firstItemNames[y]) {
                                count++;
                                break;
                            }
                        }
                    }

                    //inform users for the new post(s)
                    if (count != secondItemNames.length) {
                        var result = secondItemNames.length - count;
                        chrome.browserAction.setBadgeText({
                            text: result.toString()
                        });
                    }
                }
            }

            function HttpRequest() {
                var req = new XMLHttpRequest();
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