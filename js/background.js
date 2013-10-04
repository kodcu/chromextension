(function ($) {
    $(document).ready(function () {
        try {
            var firstItemNames, secondItemNames;
            var random = Math.floor((Math.random() * 180) + 1) + 00000;
            if (!localStorage.isInitialized) {
                localStorage.isActivated = true;
                localStorage.isCountChange = false;
            }

            if (window.webkitNotifications) {
                if (JSON.parse(localStorage.isActivated)) { getFirst(); }

                setInterval(function () {
                    if (JSON.parse(localStorage.isActivated)) {
                        if (localStorage.isCountChange != undefined &&
                        JSON.parse(localStorage.isCountChange) == true) {
                            getFirst();
                            localStorage.isCountChange = false;
                        }
                        else
                            getSecond();
                    }
                }, random);
            }

            function getFirst() {
                firstItemNames = [];
                var req = new XMLHttpRequest();
                req.open("GET", "http://www.kodcu.com/feed/", true);
                req.onload = listof;
                req.send(null);
                function listof() {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            var rss = $.parseXML(req.responseText);
                            $(rss).find("item").each(function (index, item) {
                                firstItemNames[index] = $(item).find("title").text();
                            });
                        }
                    }
                }
            }

            function getSecond() {
                secondItemNames = [];
                var req = new XMLHttpRequest();
                req.open("GET", "http://www.kodcu.com/feed/", true);
                req.onload = listof;
                req.send(null);
                function listof() {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            var rss = $.parseXML(req.responseText);
                            $(rss).find("item").each(function (index, item) {
                                secondItemNames[index] = $(item).find("title").text();
                            });
                            controlItems();
                        }
                    }
                }
            }

            function controlItems() {
                var count = 0;
                if (localStorage.isCountChange != undefined &&
                JSON.parse(localStorage.isCountChange) == false &&
                firstItemNames.length == secondItemNames.length) {

                    for (var i = 0; i < secondItemNames.length; i++) {
                        for (var y = 0; y < firstItemNames.length; y++) {
                            if (secondItemNames[i] == firstItemNames[y]) {
                                count++;
                                break;
                            }
                        }
                    }

                    if (count != secondItemNames.length) {
                        var result = secondItemNames.length - count;
                        chrome.browserAction.setBadgeText({
                            text: result.toString()
                        });
                    }

                }
            }

        } catch (err) {
            console.log(err);
        }
    });
})(jQuery);
