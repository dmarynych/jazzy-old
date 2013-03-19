define(['./Point2D', './Animation'], function (Point2D, Animation) {
    'use strict';

    var Sprite = function (data) {
        data.pos = data.pos ? data.pos : [0, 0];
        this.pos = new Point2D(data.pos);
        this.offsets = data.offsets ? new Point2D(data.offsets) : null;
        this.width = data.size[0];
        this.height = data.size[1];
        this.image = data.image;
        this.imageSrc = data.imageSrc;
        this.entity = data.entity;

        this.drawers = [];

        if (data.animData) {
            this.animation = new Animation(_.extend(data.animData, {
                imageWidth: data.image.width,
                imageHeight: data.image.height
            }));
        }
    };

    Sprite.prototype.init = function() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.canvas2d = this.canvas.getContext('2d');

        this.draw();

        $('.test_canvas').append(this.canvas);
    };



    Sprite.prototype.draw = function() {
        var spritePos = this.getSpritePos();

        this.canvas2d.clearRect(0, 0, this.width, this.height);



        this.canvas2d.drawImage(this.image,
            spritePos.x, spritePos.y,
            this.width, this.height,

            0, 0,
            this.width, this.height);

        if(this.drawers.length > 0) {
            _.each(this.drawers, function(drawer) {
                drawer(this.canvas2d);
            }.bind(this));
        }
    };

    Sprite.prototype.getSprite = function () {
        return this.canvas;
    };

    Sprite.prototype.getSpritePos = function () {
        var pos;

        if (this.animation) {
            pos = this.animation.getSpritePos();
        }
        else {
            pos = this.pos;
        }

        return pos;
    };

    Sprite.prototype.hilit = function () {

    };

    return Sprite;
});