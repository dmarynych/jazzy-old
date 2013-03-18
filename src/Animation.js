define(['./Point2D'], function (Point2D) {
    var Animation = function (data) {
        this.name = data.name;
        this.animationsRaw = data.animations;
        this.animations = {};
        this.updateInterval = data.updateInterval;
        this.imageWidth = data.imageWidth;
        this.imageHeight = data.imageHeight;
        this.tileWidth = data.tileWidth;
        this.tileHeight = data.tileHeight;

        this.lastFrameTime = new Date().getTime();
        this.currentFrame = 0;
        this.frameQueue = [];

        this.prepare();
    };

    Animation.prototype.setAnim = function (name, dir) {
        this.animName = name;
        this.animDir = dir;

        this.frameQueue = _.clone(this.animations[name + '_' + dir]);
        this.lastFrame = 0;
    };

    Animation.prototype.prepare = function () {
        var colsOnImage = Math.floor(this.imageWidth / this.tileWidth);

        _.each(this.animationsRaw, function (dirData, type) {
            _.each(dirData, function (pos, dir) {
                var ind = type + '_' + dir,
                    currcol, currow;
                if (!this.animations[ind]) {
                    this.animations[ind] = [];
                }

                for (var i = pos[0]; i <= pos[1]; i++) {
                    currow = Math.floor(i / colsOnImage);
                    currcol = i - (currow * colsOnImage);

                    this.animations[ind].push(new Point2D(currcol * this.tileWidth, currow * this.tileHeight));
                }
            }.bind(this));
        }.bind(this));
    };

    Animation.prototype.isTimeForChanges = function() {
        var currTime = new Date().getTime();

        return (currTime - this.lastFrameTime) >= this.updateInterval;
    };

    Animation.prototype.getSpritePos = function () {
        if (this.isTimeForChanges()) {
            var ql = this.frameQueue.length;
            if (this.lastFrame >= (ql - 1)) {
                this.lastFrame = 0;
            }
            else {
                this.lastFrame++;
            }

            this.lastFrameTime = new Date().getTime();
        }

        return this.frameQueue[this.lastFrame];
    };

    return Animation;
});