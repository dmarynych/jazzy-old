Jazzy
=====

The purpose for creating this engine is simple - make process of creating game simple and intuitive.

Jazzy is full stack game-framework, with bunch of features, including:
* Clean and simple api
* Loading and preloading, of any media file, like sounds, images, jsons etc.
* Great rendering speed optimisation
* Dynamic map generation, that allows you to have infinity-size map
* Visual editor, which helps you in routine of creating levels
* AMD module structure, by RequireJS

For purpose of speed optimisation, jazzy has 2 main game-object type
Tile - is any object, in background, which is not interactive.
Entity, on the contrary, is interactive game object, like monsters, trees, houses etc.

Understanding this, game bootstrapping is pretty simple.
First, you creating a game
```js
  var game = new Game({
    container: container, // DOM-element, for holding game canvas
    width: 960,
    height: 480
  });
```

Then, you need to add some player to game. Player will appear on tile, with coordinates [0, 1].
```js
game.addEntity({
    id: 'playerId',
    name: 'Player',
    pos: [1, 2]
});
```

id and pos parameters are easy to understand, but what about name?
Here we came, to one of the core concepts of Jazzy. Each Entity type, should have file, containing js-object, describing its beahaviour and game logic. These files are in folder `entities/`.

Let's have a look at our `entities/Player.js` file.
```js
define(['engine/Entity'], function(Entity) {
    var Player = function() {
        this.spriteName = 'player';
        this.moveSpeed = 32; // pixels per second
    };

    Player.prototype = new Entity();

    return Player;
});
```

spriteName is name of json-file, containing sprite data.
```json
{
    "name": "player",
    "imageSrc": "players/player.png",
    "animationName": "player",
    "size": [64, 64],
    "offsets": [-16, -40]
}
```

If this json contains animationName parameter - this sprite has animation.
File with animation data is loaded from path `animations/player.json`. It describes available animation names, for this sprite and animation speed.
```json
{
    "name": "player",

    "animations": {
        "idle": {
            "up": [0, 0],
            "left": [13, 13],
            "down": [26, 26],
            "right": [39, 39]
        },

        "walk": {
            "up": [105, 112],
            "left": [118, 125],
            "down": [131, 138],
            "right": [144, 151]
        }
    },

    "tileWidth": 64,
    "tileHeight": 64,
    "updateInterval": 100
}
```

Well, that's pretty all, for simple demo. Now we will watch for arrow-keys pressin and move player according to key.
```js
game.events.on('key:left key:up key:right key:down', function(event, name) {
    var player = game.getEntity('player');
    player.move(name);
});
```

and start the game after that
```js
game.start();
```




