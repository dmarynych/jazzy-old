define(['./Point2D'], function (Point3D) {
    var utils = {
        translateCoordsTo2D: function (pos, mode) {
            var newPos;

            if (mode === '2d') {
                newPos = new Point3D(32 * pos.x, 32 * pos.y, 0);
            }

            return newPos;
        }
    };

    return utils;
});