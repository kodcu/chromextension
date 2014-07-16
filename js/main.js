(function ($) {
    $(document).ready(function () {
        try {
            var storedBooks = true;

            $('a.more-link,a.catehref,h1 a,ul li a').live('click', function () {
                chrome.tabs.create({
                    'windowId': chrome.windows.WINDOW_ID_CURRENT,
                    'url': $(this).attr('href'),
                    'selected': true
                });
            });

            $('.starBookmark').live('click', function () {
                var source = $(this).attr('source');
                var access = $(this).attr('access');
                //if the requested bookmark has not been already marked!
                if (access == "false") {
                    chrome.bookmarks.create({
                        'title': $(this).attr('booktitle'),
                        'url': source
                    },
                    function (newFolder) {
                        console.log("New bookmark:" + newFolder.title);
                    });
                                       
                    $(this).attr("access", "true");
                    $(this).attr("title", "Bu haberi yıldıza tekrar tıklayarak yer iminizden çıkartabilirsiniz");
                    $(this).css({ 'background': 'url(/images/star.png) 0 50% no-repeat' });
                }
                else {
                    //delete the intended bookmark from (others bookmarks) section
                    var bookmarkTreeNodes = chrome.bookmarks.getTree(
                    function (bookmarkTreeNodes) {
                        walkTreeNodes(bookmarkTreeNodes, source);
                    });

                    $(this).attr("access", "false");
                    $(this).attr("title", "Bu haberi yer iminize ekleyin");
                    $(this).css({ 'background': 'url(/images/unstar.gif) 0 50% no-repeat' });
                }
            });

            function walkTreeNodes(bookmarkNodes, source) {
                var i;
                for (i = 0; i < bookmarkNodes.length; i++) {
                    deleteNode(bookmarkNodes[i], source);
                }
            }

            function deleteNode(bookmarkNode, source) {
                if (bookmarkNode.title) {
                    //delete the bookmark
                    if (String(bookmarkNode.url) == source) {
                        chrome.bookmarks.remove(String(bookmarkNode.id));
                        console.log("The bookmark has been deleted!");
                    }
                }
                if (bookmarkNode.children && bookmarkNode.children.length > 0) {
                    walkTreeNodes(bookmarkNode.children, source);
                }
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
                req.setRequestHeader("Pragma", "no-cache");
                req.setRequestHeader("Cache-Control", "no-cache");
                req.onload = listof;
                req.send();

                function listof() {
                    $listAll = "";
                    if (req.readyState == 4 && req.status == 200) {

                        var response = req.responseText;
                        var rss = $.parseXML(response);
                        $(rss).find("item").each(function (index, item) {
                            var $listcate = "";
                            var count = 0;
                            var $desc = $(item).find("description").text();
                            var href = $(item).find("link").text();

                            var date = $.trim($(item).find("pubDate").text().substr(4, 12));
                            var listDate = date.split(" ");
                            var month = getMonthAbbreviation(listDate[1]);
                            var img = $(item).find("description").text().substr(0, $desc.indexOf('>') + 1);

                            $(item).find("category").each(function (indexs, items) {
                                $listcate += '<a class="catehref" style="margin-right:1px;margin-left:1px;" href=http://www.kodcu.com/icerik/' + $(items).text() + ' title="' + $(items).text() + ' kategorisindeki t&#252;m yaz&#305;lar&#305; g&#246;ster" rel="category tag">' + $(items).text() + '</a> // ';
                                if (++count == 5)
                                    return false;
                            });                            

                            $listAll += '<div class="postBoxMid">' +
                            '<div class="postBoxMidInner first clearfix">' +
                            '<div class="date"><span>' + listDate[0] + " " + month + " " + listDate[2] + '</span></div>' +
                            '<div class="category"> ' +
                            '<div class="starBookmark" source="' + href + '" booktitle="' + $(item).find("title").text() + '" access="" title="" index="' + index + '"></div>' +
                            '<div style="margin-left: 15px;width:288px">' + $listcate.substr(0, $listcate.length - 3) + '</div></div>' +
                            '<h1> <a href="' + href + '">' + $(item).find("title").text() + '</a></h1>' +
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

                            setBookmarks(href,index);
                        });
                        $('.headItem').css({ 'display': 'block' });
                        $('.articles').html($listAll);
                        document.body.style.height = "100%";
                        console.log("Kodcu.com");
                    }
                    else {
                        console.log(req.status);
                    }
                }
            }
            var articles = GetArticles();

            function setBookmarks(href,index) {
                chrome.bookmarks.search(href, function (bookmarkTreeNodes) {
                    var book = {};
                    if (bookmarkTreeNodes.length > 0) {
                        book = {
                            title: "Bu haberi yıldıza tekrar tıklayarak yer iminizden çıkartabilirsiniz",
                            access: "true",
                            cssStyle: "background: url(/images/star.png) 0px 50% no-repeat;",
                            indexElem: index
                        };
                    }
                    else {
                        book = {
                            title: "Bu haberi yer iminize ekleyin",
                            access: "false",
                            cssStyle: "background: url(/images/unstar.gif) 0px 50% no-repeat;",
                            indexElem: index
                        };
                    }

                    $(".starBookmark[index='" + book.indexElem + "']").attr("access", book.access);
                    $(".starBookmark[index='" + book.indexElem + "']").attr("title", book.title);
                    $(".starBookmark[index='" + book.indexElem + "']").attr("style", book.cssStyle);

                });
            }
            function getMonthAbbreviation(month) {
                switch (month) {
                    case "Jan":
                        return "Oca";
                        break;
                    case "Feb":
                        return "&#350;ub";
                        break;
                    case "Mar":
                        return "Mart";
                        break;
                    case "Apr":
                        return "Nis";
                        break;
                    case "May":
                        return "May";
                        break;
                    case "Jun":
                        return "Haz";
                        break;
                    case "Jul":
                        return "Tem";
                        break;
                    case "Aug":
                        return "A&#287;u";
                        break;
                    case "Sep":
                    case "Sept":
                        return "Eyl";
                        break;
                    case "Oct":
                        return "Eki";
                        break;
                    case "Nov":
                        return "Kas";
                        break;
                    case "Dec":
                        return "Ara";
                        break;
                }
            }

        } catch (err) {
            console.log(err);
        }
    });
})(jQuery);
