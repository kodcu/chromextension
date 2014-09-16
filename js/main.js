
$(document).ready(function () {
        try {      

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

                            postHTML +=
                            '<div class="postBoxMid">' +
                            '<div class="postBoxMidInner first clearfix">' +
                            '<div class="date"><span>' + post.getDate() + '</span></div>' +
                            '<div class="category"> ' +
                            '<div class="starBookmark" source="' + post.href + '" booktitle="' + post.title + '" access="" title="" index="' + index + '"></div>' +
                            '<div style="margin-left: 15px;"><ul class="tags">' + post.getCategories() + '</ul></div></div>' +
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
                            //linkedIn
                            '<a class="lIn" title="Share" href="'+post.getLinkedInURL+'"></a>'+
                            '</div>' +
                            '<div class="base" style="cursor: pointer;">' +
                            '<a class="read" href="' + post.href + '"></a>' +
                            '<h1>' + post.title + '</h1>' +
                            '<div class="postThumb"><img height="100" style="max-width:200px;" src="' + $(post.image).attr('src') + '"></div>' +
                            '<div class="textPreview"><p>' + post.getDescription() + '</p>' +
                            '</div></div>'+
                            '<div class="postMeta">' +
                                '<div style="border-radius: 100px;background: url(\'/images/line-light.png\');float: left;height: 36px;width: 36px;padding: 0px;margin: 0px;">'+
                                  '<img style="display:block;border-radius100px;position:relative;margin-top:2px;height:28px;margin-left: 4px;padding:0px" src="/images/male80.png" alt="Yazar"></div>' +
                                '<div style="margin-top:8px;">' +
                                    '<span style="text-decoration:underline;margin-left: 5px;">' + post.creator + '</span> taraf&#305;ndan yaz&#305;ld&#305;.</div>' +                                
                            '</div></div></div>';

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

                                listCategories += '<li><a class="catehref"' +
                                            'href=http://www.kodcu.com/icerik/' + path + " " +
                                            'title="' + name.toLowerCase() + ' kategorisindeki t&#252;m yaz&#305;lar&#305; g&#246;ster" ' +
                                            'rel="category tag">' + name.toUpperCase() + '</a></li> // ';
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

                this.getGoogleURL = "https://plusone.google.com/_/+1/fastbutton?usegapi=1&size=medium&hl=en-US&url=XXXXXXX&id=I0_1405621934019&pfname=&rpctoken=91543533".replace("XXXXXXX", this.getEncodedURL());

                this.getLinkedInURL = "https://www.linkedin.com/shareArticle?mini=true&url=XXXXXXX&title=YYYYY&source=kodcu.com".replace("XXXXXXX", this.getEncodedURL()).replace("YYYYY", this.title);
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
        } catch (err) {
            console.log(err);
        }
});
