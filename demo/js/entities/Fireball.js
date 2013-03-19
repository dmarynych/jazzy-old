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
        this.target = target;
        this.moveToTile(target.pos);
    };

    Fireball.prototype.onMoveEnd = function() {
        this.destroy();

        this.target.dealDamage(1);
    };

    return Fireball;
});