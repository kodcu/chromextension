$(document).ready(function () {
    
    $('a.more-link,a.catehref,a.pano,a.github,a.linked,a.authors,a.egitim,a.send').live('click', function () {
        chrome.tabs.create({
            'windowId': chrome.windows.WINDOW_ID_CURRENT,
            'url': $(this).attr('href'),
            'selected': true
        });
    });

    $('.tags li a').live('mouseover', function () {
        $(this).css({ 'font-weight': 'bold' });
    }).live('mouseout', function () { $(this).css({ 'font-weight': 'normal' }) });

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

    $('.read').live('click', function () {
        chrome.tabs.create({
            'windowId': chrome.windows.WINDOW_ID_CURRENT,
            'url': $(this).attr('href'),
            'selected': false
        });
    });

    $('.base').live('mouseover', function () {
        var height = $(this).height();
        $(this).find("a").css({ 'height': height + 'px' });
        $(this).find("a").css({ 'display': 'block' });
        $(this).css({ 'opacity': '0.8' });
    }).live('mouseout', function () {
        $(this).find("a").css({ 'height': '0px' });
        $(this).find("a").css({ 'display': 'none' });
        $(this).css({ 'opacity': '1', });
    });
});
