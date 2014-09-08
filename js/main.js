(function ($) {
    $(document).ready(function () {
        try {

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

            $('.property').live('click', function () {
                var navi = document.getElementsByTagName('ul');
                var pixel = $(navi).css('margin-right');
                if (pixel === "-28px") {
                    $(navi).css({ 'margin-right': '-160px' });
                    $('.property').css({ 'background-image': 'url(/images/right.png)' });
                }else {
                    $(navi).css({ 'margin-right': '-28px' });
                    $('.property').css({ 'background-image': 'url(/images/left.png)' });
                }
            });

            $('.read').live('click', function () { 
                chrome.tabs.create({
                    'windowId': chrome.windows.WINDOW_ID_CURRENT,
                    'url': $(this).attr('href'),
                    'selected': false
                });
            });

            $('.base').live('mouseover', function() {
                    var height = $(this).height();
                    $(this).find("a").css({ 'height': height + 'px' });
                    $(this).find("a").css({ 'display': 'block' });
                    $(this).css({ 'opacity': '0.8'});
            }).live('mouseout',function () {
                    $(this).find("a").css({ 'height': '0px' });
                    $(this).find("a").css({ 'display': 'none' });
                    $(this).css({ 'opacity': '1', });
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
                chrome.browserAction.setBadgeText({ text: "" });
            }
            chrome.browserAction.onClicked.addListener(updateIcon);
            updateIcon();

            //get the list of articles consisting of HTML elements
            var GetArticles = function () {

                var req = new XMLHttpRequest();
                var timeout = setTimeout(function () {
                    req.abort();
                }, 60000);
                req.open("GET", "http://www.kodcu.com/feed/", true);
                req.setRequestHeader("Pragma", "no-cache");
                req.setRequestHeader("Cache-Control", "no-cache");
                req.onload = listof;
                req.send();

                function listof() {
                    var postHTML = "";
                    if (req.readyState == 4 && req.status == 200) {

                        var response = req.responseText;
                        var rss = $.parseXML(response);
                        var HashTable = new hashtable();
                        var ItemList = [];

                        $(rss).find("item").each(function (index, item) {

                            var post = new article($(item), HashTable);
                            ItemList[index] = post.title;

                            postHTML += '<div class="postBoxMid">' +
                            '<div class="postBoxMidInner first clearfix">' +
                            '<div class="date"><span>' + post.getDate() + '</span></div>' +
                            '<div class="category"> ' +
                            '<div class="starBookmark" source="' + post.href + '" booktitle="' + post.title + '" access="" title="" index="' + index + '"></div>' +
                            '<div style="margin-left: 15px;width:288px">' + post.getCategories() + '</div></div>' +
                            '<div style="margin-top: 5px;margin-bottom: 5px;">' +
                            //facebook
                            '<iframe src="' + post.getFaceURL + '" ' +
                            'scrolling="no" frameborder="0" style="border: none; ' +
                            'overflow: hidden; height: 21px;  margin-top: 8px; width: 130px; margin-left:0px;" allowTransparency="true"></iframe>' +
                            //twitter
                            '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="' + post.getTwitURL + '" style="border:0px;width:84px; height:21px;"></iframe>' +
                            //google+
                            '<iframe src="' + post.getGoogleURL + '" allowtransparency="true" target="_parent" frameborder="0" scrolling="no" style="width: 64px;height: 21px; border:0;"'+
                            'marginheight="0"  marginwidth="0" frameborder="0" scrolling="no"  title="+1"></iframe>' +
                            '</div>' +
                            '<div class="base">'+
                            '<a class="read" href="' + post.href + '"></a>' +
                            '<h1>' + post.title + '</h1>' +
                            '<div class="postThumb"><img height="100" style="max-width:200px;" src="' + $(post.image).attr('src') + '"></div>' +
                            '<div class="textPreview"><p>' + post.getDescription() + '</p>' +
                            '</div>'+
                            '</div>'+
                            '<div class="postMeta">' +
                                '<div style="border-radius: 100px;background: url(\'/images/line-light.png\');float: left;height: 36px;width: 36px;padding: 0px;margin: 0px;">'+
                                  '<img style="display:block;border-radius100px;position:relative;margin-top:2px;height:28px;margin-left: 4px;padding:0px" src="/images/male80.png" alt="Yazar"></div>' +
                                '<div style="margin-top:8px;">' +
                                    '<span style="text-decoration:underline;margin-left: 5px;">' + post.creator + '</span> taraf&#305;ndan yaz&#305;ld&#305;.</div>' +                                
                            '</div>' +
                            '</div>' +
                            '</div>';

                            setBookmarks(post.href, index);
                        });
                        //serialization
                        localStorage.setItem('firstAttempt', JSON.stringify(ItemList));

                        $('.headItem').css({ 'display': 'block' });
                        $('.articles').html(postHTML);
                        document.body.style.height = "100%";
                        var html = document.getElementsByTagName('html');
                        $(html).css('background-image', 'none');
                        console.log("Kodcu.com");
                    }
                    else {
                        console.log(req.status);
                    }
                }
            }
            var articles = GetArticles();

            // an article object to specify each post that returns from the rss.
            var article = function (post, hashtable) {

                this.creator = post.find("creator").text();
                this.title = post.find("title").text();
                this.href = post.find("link").text();
                var description = post.find("description").text();
                this.image = description.substr(0, description.indexOf('>') + 1);

                this.getDescription = function () {
                    return description.substr(description.indexOf('>') + 1);
                }

                this.getDate = function () {
                    var datelist = post.find("pubDate").text().substr(4, 12).trim().split(" ");
                    var month = getMonthAbbreviation(datelist[1]);
                    return datelist[0] + " " + month + " " + datelist[2];
                }

                this.getCategories = function () {
                    var listCategories = "";
                    var uniqueList = [];
                    post.find("category").each(function (indexs, item) {
                        var path = hashtable.getValue($(item).text().trim().toLowerCase());
                        if (path != undefined) {
                            if (uniqueList.length == 0 || uniqueList.indexOf(path) == -1) {
                                uniqueList.push(path);
                                var name = $(item).text().trim();

                                listCategories += '<a class="catehref" style="margin-right:1px;margin-left:1px;" ' +
                                            'href=http://www.kodcu.com/icerik/' + path + " " +
                                            'title="' + name.toLowerCase() + ' kategorisindeki t&#252;m yaz&#305;lar&#305; g&#246;ster" ' +
                                            'rel="category tag">' + name.toUpperCase() + '</a> // ';
                            }
                        }
                    });
                    return listCategories.substr(0, listCategories.length - 3);
                }

                this.getEncodedURL = function () {
                    //replace ':' and '/'                    
                    return this.href.replace(/:/g, "%3A").replace(/\//g, "%2F");
                }

                this.getFaceURL = "http://www.facebook.com/plugins/like.php?href=XXXXXXX&amp;width=21&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21&amp;appId=229499750441210".replace("XXXXXXX", this.getEncodedURL());

                this.getTwitURL = "https://platform.twitter.com/widgets/tweet_button.html?text=YYYYY&url=XXXXXXX".replace("XXXXXXX", this.getEncodedURL()).replace("YYYYY",this.title);

                this.getGoogleURL = "https://plusone.google.com/_/+1/fastbutton?usegapi=1&size=medium&hl=en-US&url=XXXXXXX&gsrc=3p&ic=1&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en.ujUWkKAfC4A.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Ft%3Dzcms%2Frs%3DAItRSTNvVCaXXg92G3Y4v6FEA18mJwCnsA#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh&id=I0_1405621934019&pfname=&rpctoken=91543533".replace("XXXXXXX", this.getEncodedURL());

                this.getLinkedInURL = "https://www.linkedin.com/shareArticle?mini=true&url=XXXXXXX&title=YYYYY&source=kodcu.com".replace("XXXXXXX", this.getEncodedURL()).replace("YYYYY", this.title);
            }

            //an hash table for a few of categories described in Kodcu.com
            var hashtable = function () {

                var url = new Object();
                url["yazılım"] = "yazilim";
                url["yazılar"] = "yazilar";
                url["kitap"] = "kitap-2";
                url["agile"] = "agile-2";
                url["java"] = "yazilar/java";
                url["kanban"] = "kanban";
                url["eğitim"] = "egitim-2";
                url["egitim"] = "egitim-2";
                url["big data"] = "big-data";
                url["html 5"] = "html-5";
                url["javascript & ajax"] = "yazilar/javascript-ajax";
                url["sql"] = "sql-2";
                url["veritabanlari"] = "yazilar/veritabanlari";
                url["webinar"] = "webinar";
                url["python"] = "yazilar/python";
                url["java güvenlik çatıları"] = "java-guvenlik-catilari";
                url["apache shiro"] = "java-guvenlik-catilari/apache-shiro-java-guvenlik-catilari";
                url["güvenlik"] = "guvenlik-2";
                url["html & css"] = "yazilar/html-css";
                url["nosql"] = "nosql-2";
                url["mangodb"] = "nosql-2/mangodb-2";
                url["mobil"] = "mobil-2";
                url["verimlilik"] = "verimlilik";
                url["javaee 7"] = "java-ee-7-2";
                url["tutorial"] = "tutorial-2";
                url["game"] = "game";
                url["mobil"] = "mobil-2";
                url["ios"] = "yazilar/ios-yazilar";
                url["grails"] = "grails";
                url["javaee"] = "javaee-2";
                url[".net"] = "yazilar/dotnet";
                url["spring çatısı"] = "spring-catisi";
                url["sunucu"] = "sunucu";
                url["girisimcilik"] = "girisimcilik";
                url["girişimcilik"] = "girisimcilik";
                url["web intelligence"] = "web-intelligence";
                url["yapay zeka"] = "yapay-zeka";
                url["java enterprise edition"] = "java-enterprise-edition";
                url["startup"] = "startup";
                url["android"] = "yazilar/android-yazilar";
                url["javaserver faces"] = "javaserver-faces";
                url["is zekasi"] = "yazilar/is-zekasi";
                url["iş zekasi"] = "yazilar/is-zekasi";
                url["php"] = "yazilar/php";
                url["jpa"] = "jpa-2";
                url["pano"] = "pano-2";

                this.getValue = function (key) {
                    return url[key];// can return undefined!
                }

            }

            //initialize the bookmark(s) that include(s) in the other bookmarks folder
            function setBookmarks(href, index) {
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

            //get the turkish month abbreviation
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
