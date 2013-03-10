define(['./Point2D', './Animation'], function(Point2D, Animation) {
    'use strict';

    var Sprite = function(data) {
        this.pos = new Point2D(data.pos);
        this.offsets = data.offsets ? new Point2D(data.offsets) : null;
        this.width = data.size[0];
        this.height = data.size[1];
        this.image = data.image;


        if(data.animData) {
            this.animation = new Animation(_.extend(data.animData, {
                imageWidth: data.image.width,
                imageHeight: data.image.height
            }));
        }

        this.imageSrc = data.imageSrc;
    };

    Sprite.prototype.getSpritePos = function() {
        var pos;

        if(this.animation) {
            pos = this.animation.getSpritePos();
        }
        else {
            pos = this.pos;
        }

        return pos;
    };

    return Sprite;
});