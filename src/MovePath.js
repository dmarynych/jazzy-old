
define(['./Point3D', './utils'], function(Point3D, utils) {
    var MovePath = function(path) {
        this.path = path;
        this.numSteps = this.path.length;
        this.steps = [];

        this.createWalkPath(this.path[0], this.path[1], 32, 60);
    };

    MovePath.prototype.createWalkPath = function(from, to, speed, currFps) {
        var animStep = 3,
            steps = Math.ceil(currFps / animStep),
            fromTr = utils.translateCoordsTo2D(this.path[0], '2d'),
            toTr = utils.translateCoordsTo2D(this.path[1], '2d'),
            distX = (toTr.x - fromTr.x),
            distY = (toTr.y - fromTr.y),
            distPerStepX = distX / steps,
            distPerStepY = distY / steps,
            animPath = [],
            i, j;

        i = 0, j = 1;
        while(i < currFps) {
            if(i % animStep === 0) {
                animPath.push([Math.ceil(j*distPerStepX), Math.ceil(j*distPerStepY)]);
                j++;
            }
            i++;
        }

        this.steps = animPath;
    };

    MovePath.prototype.isTimeForChanges = function() {
        return true;
    };

    MovePath.prototype.checkPos = function() {
        this.dirty = true;
    };


    return MovePath;
});