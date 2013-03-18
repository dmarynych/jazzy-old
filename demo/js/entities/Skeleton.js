define(['Entity'], function(Entity) {
    var Skeleton = function() {
        this.spriteName = 'skeleton';
        this.direction = 'left';
        this.animationName = 'idle';

        this.maxHp = 10;

        this.displayHp = true;
    };
    Skeleton.prototype = new Entity();

    Skeleton.prototype.onInit = function() {
        this.hp = this.maxHp;
    };

    Skeleton.prototype.showHp = function() {
        this.drawers.add('hpbar', function(canvas) {

        });
    };

    Skeleton.prototype.hideHp = function() {

    };

    return Skeleton;
});