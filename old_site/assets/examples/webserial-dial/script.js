setInterval(function() {
    var newVal = Math.floor((Math.random() * 179) + 1);

    $('.gauge--3 .semi-circle--mask').attr({
        style: '-webkit-transform: rotate(' + newVal + 'deg);' +
        '-moz-transform: rotate(' + newVal + 'deg);' +
        'transform: rotate(' + newVal + 'deg);'
    });
}, 1000);
