define(['Entity'], function(Entity) {
    var Player = function() {
        this.spriteName = 'skeleton';
        this.direction = 'left';
        this.animationName = 'idle';



    };
    Player.prototype = new Entity();



    return Player;
});