define(['Entity'], function(Entity) {
    var Stump = function() {
        this.spriteName = 'stump';
    };

    Stump.prototype.onInit = function() {
        fbug(this.name +' was inited');
    };

    Stump.prototype.onMouseOver = function() {
        fbug(this.name +' was mouseovered');
    };


    Stump.prototype = new Entity();

    return Stump;
});