
$(document).ready(function () {

    $('.lIn').live('click', function () {
        createPopup($(this).attr('href'));
    });
    
    function createPopup(href) {
        var left = (screen.width / 2) - (600 / 2);
        var top = (screen.height / 2) - (600 / 2);
        var popup = open(href, "Share", 'width=600,height=600,status=yes,toolbar=no,menubar=no,copyhistory=no, top=' + top + ', left=' + left + '"');
    }
});