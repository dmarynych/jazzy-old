define(['Entity'], function(Entity) {
    var Player = function() {
        this.spriteName = 'player';
        this.direction = 'right';
        this.animationName = 'idle';


    };

    Player.prototype = new Entity();

    return Player;
});