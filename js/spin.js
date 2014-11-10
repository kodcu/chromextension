(function ($) {
    $(document).ready(function () {
        var opts = {
            lines: 17,
            length: 0,
            width: 7, 
            radius: 25, 
            corners: 1, 
            rotate: 0, 
            direction: 1, 
            color: '#0587c3',
            speed: 0.8, 
            trail: 50, 
            shadow: false,
            hwaccel: false, 
            className: 'spinner', 
            zIndex: 2e9, 
            top: '50%', 
            left: '50%' 
        };
        var target = document.getElementById('loader');
        var spinner = new Spinner(opts).spin(target);
        target.appendChild(spinner.el);
    });
})(jQuery);