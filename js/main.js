$(document).ready(function () {
    chrome.browserAction.onClicked.addListener(updateIcon);
    updateIcon();
    var timeout = setTimeout(function () {
        getArticles();
    }, 1000);
    timeout = null;
});

var req;

function updateIcon() {
    chrome.browserAction.setIcon({ path: "images/icon.png" });
    chrome.browserAction.setBadgeText({ text: "" });
}

//get the list of articles consisting of HTML elements
function getArticles() {
    req = new XMLHttpRequest();
    var timeout = setTimeout(function () {
        req.abort();
    }, 60000);
    req.open("GET", "http://pano.kodcu.com/chrome/posts", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Pragma", "no-cache");
    req.setRequestHeader("Cache-Control", "no-cache");
    req.onload = listof;
    req.send();
}

function listof() {

    if (req.readyState == 4 && req.status == 200) {
        var postHTML = "";

        var data = $.parseJSON(req.responseText);
        var hash = new hashtable();
        var freshList = [];
        var loader = document.getElementById('loader');
        $(loader).css({ 'display': 'none' });

        $.each(data, function (index, item) {

            var post = new article(item, hash);
            freshList[index] = post.title;

            postHTML +=
            '<div class="postBoxMid">' +
            '<div class="postBoxMidInner first clearfix">' +
            '<div class="flag"><img src="/images/lang-' + post.language + '.png"></div>' +
            '<div class="date"><span>' + post.getDate() + '</span></div>' +            
            '<div class="category"> ' +
            '<div class="starBookmark" source="' + post.href + '" booktitle="' + post.title + '" access="" title="" index="' + index + '"></div>' +
            '<div style="margin-left: 15px;"><ul class="tags">' + post.getCategories() + '</ul></div></div>' +
            '<div class="social-network" style="margin-bottom: 5px;">' +
            //facebook
            '<iframe src="' + post.getFaceURL + '" ' +
            'scrolling="no" frameborder="0" style="border: none; ' +
            'overflow: hidden; height: 21px;  margin-top: 8px; width: 130px; margin-left:0px;" allowTransparency="true"></iframe>' +
            //twitter
            '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="' + post.getTwitURL + '" style="border:0px;width:84px; height:21px;"></iframe>' +
            //google+
            '<iframe src="' + post.getGoogleURL + '" allowtransparency="true" target="_parent" frameborder="0" scrolling="no" style="width: 64px;height: 21px; border:0;"' +
            'marginheight="0"  marginwidth="0" frameborder="0" scrolling="no"  title="+1"></iframe>' +
            //linkedIn
            '<a class="lIn" title="Share" href="' + post.getLinkedInURL + '"></a>' +
            '</div>' +
            '<div class="base" style="cursor: pointer;">' +
            '<a class="read" href="' + post.href + '"></a>' +
            '<div class="postThumb">' + post.getImage() + '</div>' +
            '<h1>' + post.title + '</h1>' +
            '<div class="textPreview"><p>' + post.getDescription() + '</p>' +
            '</div></div>' +
            '<div class="postMeta">' +
                '<div class="author-display">' +
                    '<img class="author-img" src="' + post.getAuthorImage() + '" alt="Yazar"></div>' +
                '<div style="margin-top: 14px;margin-left: 2px;float: left;">' +
                    '<a class="author-url" href="' + post.creator_url + '">' + post.creator + "</a> taraf&#305;ndan yaz&#305;ld&#305;.</div>" +
            '</div></div></div>';

            setBookmarks(post.href, index);
        });
        //serialization
        localStorage.setItem('POST_TITLES', JSON.stringify(freshList));
        $('.headItem').css({ 'display': 'block' });
        $('.articles').html(postHTML);
        document.body.style.height = "100%";
        console.log("Kodcu.com");
    }
    else {
        console.log(req.status);
    }
}

// an article object to specify each post that returns from the rss.
var article = function (post, hashtable) {

    this.creator = post.post_author;//.replace(/\s+/g, '');
    this.creator_url = post.post_author_url;
    this.creator_mail = post.post_author_email;
    this.title = post.post_title;
    this.href = post.post_url;
    this.language = post.post_language;
    this.post_dt = new Date(parseInt(post.post_date));

    this.getImage = function () {
        var url = post.post_image;
        var image;
        if (url == undefined) {
            image =  "/images/undefined.png";
        }
        else {
            image = "http://kodcu.com/wp/wp-content/uploads/".concat(url);
        }
        var html_image = "<img class=\"post-image\" src='" + image + "'>";
        return html_image;
    }

    this.getAuthorImage = function (){
        var hashed = calcMD5(this.creator_mail);
        var gravatar = "http://www.gravatar.com/avatar/".concat(hashed);
        return gravatar;
    }

    this.getDescription = function () {
        var content = post.post_content;
        return content.concat("...");
    }

    this.getDate = function () {
        return $.format.date(this.post_dt, "dd MMM yyyy");
    }

    this.getCategories = function () {
        var listCategories = "";
        $.each(post.post_categories ,function (index, item) {
            var path = hashtable.getValue(item.toLowerCase());
            if (path != undefined) {
                var name = item;

                listCategories += '<li><a class="catehref"' +
                'href=http://www.kodcu.com/icerik/' + path + " " +
                'title="' + name.toLowerCase() + ' kategorisindeki t&#252;m yaz&#305;lar&#305; g&#246;ster" ' +
                'rel="category tag">' + name.toUpperCase() + '</a></li> // ';
            }
        });
        return listCategories.substr(0, listCategories.length - 3);
    }

    this.getEncodedURL = function () {
        var url;
        if (this.language == "en") {
            url = "http://en.kodcu.com/".concat($.format.date(this.post_dt, "yyyy/MM/")).concat(post.post_name).concat("/");
        }
        else {
            url = "http://kodcu.com/".concat($.format.date(this.post_dt, "yyyy/MM/")).concat(post.post_name).concat("/");
        }
        //replace ':' and '/'                    
        return url.replace(/:/g, "%3A").replace(/\//g, "%2F");
    }

    this.getFaceURL = "http://www.facebook.com/plugins/like.php?href=XXXXXXX&amp;width=21&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21&amp;appId=229499750441210".replace("XXXXXXX", this.getEncodedURL());

    this.getTwitURL = "https://platform.twitter.com/widgets/tweet_button.html?text=YYYYY&url=XXXXXXX".replace("XXXXXXX", this.getEncodedURL()).replace("YYYYY", this.title);

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