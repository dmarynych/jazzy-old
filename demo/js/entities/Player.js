define(['Entity'], function(Entity) {
    var Player = function() {
        this.spriteName = 'player';
        this.direction = 'right';
        this.animationName = 'idle';


    };
    Player.prototype = new Entity();


    Player.prototype.castSpell = function(spellname, target) {
        var tile = this.map.getTileByPoint(target),
            dir = this.getDirection(this.pos, tile),
            nearest = this.getNearestTile(dir);
fbug(['dfd', this.pos, tile, dir, nearest])
        this.map.game.addEntity({
            id: 'fireball',
            name: 'Fireball',
            pos: [nearest.x, nearest.y]
        }, function(fb) {
            fbug('move fb');


            fb.moveToPoint(target);
        });
    };



    return Player;
});