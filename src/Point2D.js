define([], function() {
    'use strict';

    var Point2D = function( x, y ) {
        this.x = _.isArray( x ) ? parseInt(x[0], 10) : parseInt(x, 10);
        this.y = _.isArray( x ) ? parseInt(x[1], 10) : parseInt(y, 10);

        this.str = this.x +'_'+ this.y;
    };

    Point2D.prototype.inRect = function( x, y, width, height ) {
        return (this.x >= x && this.x <= (x + width) && this.y >= y && this.y <= (y + height));
    };

    Point2D.prototype.add = function(x, y) {
        this.x += x ? x : 0;
        this.y += y ? y : 0;
    };

    return Point2D;
});