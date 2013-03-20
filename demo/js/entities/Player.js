define(['Entity'], function(Entity) {
    var Player = function() {
        this.spriteName = 'player';
        this.direction = 'right';
        this.animationName = 'idle';
        this.followMap = true;

    };
    Player.prototype = new Entity();


    return Player;
});