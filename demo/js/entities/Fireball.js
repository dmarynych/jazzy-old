define(['./../Entity'], function (Entity) {
    var Fireball = function(caster) {
        this.entityType = 'spell';
        this.spriteName = 'fireball';
        this.direction = 'left';
        this.animationName = 'move';
        this.pathfinding = false;

        this.caster = caster;

    };

    Fireball.prototype = new Entity();

    Fireball.prototype.cast = function(target) {

    };

    Fireball.prototype.onMoveEnd = function() {
        this.destroy();

        this.game.getEntity('skeleton').setAnimation('death');
        setTimeout(function() {
            this.game.getEntity('skeleton').setAnimation('dead');
        }.bind(this), 600);
    };

    return Fireball;
});