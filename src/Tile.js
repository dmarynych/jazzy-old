define(['./Point2D', './Point3D', './Sprite'], function(Point2D, Point3D, Sprite) {
    'use strict';

    var Tile = function(data) {
        this.width = data.sprite.size[0];
        this.height = data.sprite.size[1];
        this.pos = data.pos;

        this.sprite = new Sprite(data.sprite);
        this.type = data.type;
        this.props = data.props || [];


    };

    return Tile;
});