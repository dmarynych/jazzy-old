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

    /**
     * Checking if Tile has given property.
     *
     * @param {String} prop
     * @returns {boolean}
     */
    Tile.prototype.hasProp = function(prop) {
        return _.indexOf(this.props, prop) !== -1;
    };

    /**
     * Adding of new Tile property. Something like 'walkable', 'water', 'rock'
     * and any other, whatever your game needs.
     *
     * @param prop
     */
    Tile.prototype.addProp = function(prop) {
        if(!this.hasState(prop)) {
            this.props.push(prop);
        }
    };

    /**
     * Removing any of Tile prop.
     *
     * @param prop
     */
    Tile.prototype.removeProp = function(prop) {
        if(this.hasState(prop)) {
            this.props = _.without(this.props, prop);
        }
    };

    return Tile;
});