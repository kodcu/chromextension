$(document).ready(function () {

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

});