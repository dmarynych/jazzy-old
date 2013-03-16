define(['./../Entity'], function (Entity) {
    var Fireball = function() {
        this.entityType = 'spell';
        this.spriteName = 'fireball';
        this.direction = 'left';
        this.animationName = 'move';


    };

    Fireball.prototype = new Entity();

    Fireball.prototype.onMoveEnd = function() {
        this.destroy();
    };

    return Fireball;
});