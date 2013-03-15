define(['./Point3D', './Point2D', './utils'], function (Point3D, Point2D, utils) {
    var MovePath = function (path) {
        this.path = [];
        this.stepPairs = [];
        this.numSteps = path.length;

        this.init(path);
    };

    MovePath.prototype.init = function (path) {fbug(['init mp', path])
        _.each(path, function (step, k) {
            var currst = new Point3D(step[0], step[1]);

            this.path.push(currst);
            var next = path[k + 1];
            if (next) {
                this.stepPairs.push([new Point3D(step[0], step[1]), new Point3D(next[0], next[1])]);
            }
        }.bind(this));

        this.targetPos = this.path[this.path.length - 1];

        this.steps = [];

        _.each(this.stepPairs, function (step, k) {
            var ls = this.steps[this.steps.length - 1] || new Point3D(0, 0);
            this.createWalkPath(step[0], step[1], 32, 60, ls.x, ls.y);
        }.bind(this));fbug(_.clone(this.steps))
    };

    MovePath.prototype.createWalkPath = function (from, to, speed, currFps, offsetX, offsetY) {
        var animStep = 3,
            steps = Math.ceil(currFps / animStep),
            fromTr = utils.translateCoordsTo2D(from, '2d'),
            toTr = utils.translateCoordsTo2D(to, '2d'),
            distX = (toTr.x - fromTr.x),
            distY = (toTr.y - fromTr.y),
            distPerStepX = distX / steps,
            distPerStepY = distY / steps,
            i, j, x, y;

        i = 0;
        j = 1;
        while (i < currFps) {
            if (i % animStep === 0) {
                x = Math.ceil(j * distPerStepX) + offsetX;
                y = Math.ceil(j * distPerStepY) + offsetY;

                this.steps.push(new Point2D(x, y));
                j++;
            }
            i++;
        }
    };

    MovePath.prototype.isTimeForChanges = function () {
        return true;
    };

    MovePath.prototype.checkPos = function () {
        this.dirty = true;
    };


    return MovePath;
});