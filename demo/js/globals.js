_.average = function(arr) {
    return _.reduce(arr, function(memo, num) {
        return memo + num;
    }, 0 ) / arr.length;
};

var fbug = function(s) {
    'use strict';

    if( (typeof(console) !== 'undefined') && (typeof(console.log) !== 'undefined') ) {
        console.log(s);
    }
};

String.prototype.replaceAll = function(search, replace){
    'use strict';

    return this.split(search).join(replace);
};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
    'use strict';

    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
        };
})();