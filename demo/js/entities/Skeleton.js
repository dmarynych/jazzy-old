define(['Entity'], function(Entity) {
    var Skeleton = function() {
        this.spriteName = 'skeleton';
        this.direction = 'left';
        this.animationName = 'idle';
        this.props = ['bad'];

        this.hp = 4;
        this.maxHp = 10;

        this.displayHp = true;
    };
    Skeleton.prototype = new Entity();

    Skeleton.prototype.onInit = function() {
        //this.hp = this.maxHp;
    };



    return Skeleton;
});