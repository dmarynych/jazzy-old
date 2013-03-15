define([], function () {
    'use strict';

    /**
     @class
     @constructor
     */
    var Point3D = function (x, y, z) {
        this.x = parseInt(x, 10);
        this.y = parseInt(y, 10);
        this.z = parseInt(z, 10) || 0;

        this.str = this.z + '_' + x + '_' + y;
    };

    Point3D.prototype.nearestPosInDirection = function (dir) {
        var tilePos;
        if (dir === 'up') {
            tilePos = new Point3D(this.x, this.y - 1);
        }
        else if (dir === 'right') {
            tilePos = new Point3D(this.x + 1, this.y);
        }
        else if (dir === 'down') {
            tilePos = new Point3D(this.x, this.y + 1);
        }
        else if (dir === 'left') {
            tilePos = new Point3D(this.x - 1, this.y);
        }

        return tilePos;
    };

    Point3D.prototype.inRect = function (x, y, width, height) {
        return (this.x >= x && this.x <= (x + width) && this.y >= y && this.y <= (y + height));
    };
    Point3D.prototype.toArray = function () {
        return [this.x, this.y, this.z];
    };
    Point3D.prototype.isEqual = function (pos) {
        if (!pos) {
            return false;
        }

        return (this.x === pos.x && this.y === pos.y && this.z === pos.z);
    };

    Point3D.prototype.cloneWithNewZ = function (z) {
        return new Point3D(this.x, this.y, z);
    };

    return Point3D;
});

