$(document).ready(function () {
    
    $('a.more-link,a.catehref,a.pano,a.github,a.linked,a.authors,a.egitim,a.send,a.author-url,.read').live('click', function () {
        chrome.tabs.create({
            'windowId': chrome.windows.WINDOW_ID_CURRENT,
            'url': $(this).attr('href'),
            'selected': false
        });
    });

    $('.property').live('click', function () {
        var navi = $('.autonavi ul');
        var pixel = $(navi).css('margin-right');
        if (pixel === "-28px") {
            $(navi).css({ 'margin-right': '-160px' });
            $('.property').css({ 'background-image': 'url(/images/right.png)' });
        } else {
            $(navi).css({ 'margin-right': '-28px' });
            $('.property').css({ 'background-image': 'url(/images/left.png)' });
        }
    });

    $('.base').live('mouseenter', function () {
        var height = $(this).height();
        $(this).find("a").css({ 'height': height + 'px' });
        $(this).find("a").css({ 'display': 'block' });
    }).live('mouseleave', function () {
        $(this).find("a").css({ 'height': '0px' });
        $(this).find("a").css({ 'display': 'none' });
    });

    $('.tag-spec').live('mouseenter',function(){
        $(this).find(".tags").toggle();
    }).live('mouseleave', function () {
        $(this).find(".tags").toggle();
    });
});
