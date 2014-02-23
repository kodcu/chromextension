(function ($) {
    $(document).ready(function () {
        try {

            ClickListen();
            function ClickListen() {
                $('a.more-link,a.catehref,h1 a,ul li a').live('click', function () {
                    chrome.tabs.create({
                        'windowId': chrome.windows.WINDOW_ID_CURRENT,
                        'url': $(this).attr('href'),
                        'selected': true
                    });
                });
            }

            function updateIcon() {
                if (localStorage.isCountChange != undefined &&
                JSON.parse(localStorage.isCountChange) == false) {

                    chrome.browserAction.setBadgeText({ text: "" });
                    localStorage.isCountChange = true;
                }
            }
            chrome.browserAction.onClicked.addListener(updateIcon);
            updateIcon();

            var GetArticles = function () {
                var req = new XMLHttpRequest();
                req.open("GET", "http://www.kodcu.com/feed/", true);
                req.onload = listof;
                req.send(null);

                function listof() {
                    $listAll = "";
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            var response = req.responseText;
                            var rss = $.parseXML(response);
                            $(rss).find("item").each(function (index, item) {
                                var $listcate = "";
                                var $desc = $(item).find("description").text();
                                var img = $(item).find("description").text().substr(0, $desc.indexOf('>') + 1);
                                $(item).find("category").each(function (indexs, items) {
                                    $listcate += '<a class="catehref" style="margin-right:1px;margin-left:1px;" href=http://www.kodcu.com/icerik/' + $(items).text() + ' title="' + $(items).text() + ' kategorisindeki t&#252;m yaz&#305;lar&#305; g&#246;ster" rel="category tag">' + $(items).text() + '</a> // ';
                                });
                                $listAll += '<div class="postBoxMid">' +
                            '<div class="postBoxMidInner first clearfix">' +
                            '<div class="date"><span>' + $(item).find("pubDate").text().substr(4, 12) + '</span></div>' +
                            '<div class="category"> <div style="margin-left: 15px;width:288px">' + $listcate.substr(0, $listcate.length - 3) + '</div></div>' +
                            '<h1> <a href="' + $(item).find("link").text() + '">' + $(item).find("title").text() + '</a></h1>' +
                            '<div class="postThumb"><img height="100" style="max-width:200px;" src="' + $(img).attr('src') + '"></div>' +
                            '<div class="textPreview"><p>' + $desc.substr($desc.indexOf('>') + 1) + '</p>' +
                            '</div>' +
                            '<div class="postMeta">' +
                    '<a style="float: left; margin-top: 5px;margin-right: 6px;margin-top: 2px;" href="' + $(item).find("link").text() + '" class="more-link">Devam&#305;n&#305; Oku &#187;</a>' +
                               '<div class="metaRight">' +
                                 '<img style="float: left; position: relative;;margin-top: -8px;" src="http://www.kodcu.com/wp/wp-content/themes/alltuts/images/ico_author.png" alt="Yazar">' +
                                    '<div style="margin-top:2px; margin-right: 0px;">' +
                                        '<a style="text-decoration:underline;">' + $(item).find("creator").text() + '</a> taraf&#305;ndan yaz&#305;ld&#305;.</div>' +
                                '</div>' +
                            '</div>' +
                           '</div>' +
                         '</div>';
                            });
                            $('.headItem').css({ 'display': 'block' });
                            $('.articles').html($listAll);
                            document.body.style.height = "100%";
                            console.log("Kodcu.com");
                        }
                    }
                }
            }
            var articles = GetArticles();

        } catch (err) {
            console.log(err);
        }
    });
})(jQuery);
