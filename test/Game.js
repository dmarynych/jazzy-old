define(['engine/Game', 'engine/Map'], function(Game, Map) {
    $('<div id="testmap"></div>').appendTo('body');

    var container = document.getElementById('testmap'),
        game = new Game({
            container: container,
            fps: 60,
            width: 960,
            height: 480
        });


    game.start();


    describe('Game', function() {
        it('should initialize map', function() {
            expect(game.map instanceof Map).toBe(true);
        });

    });


    describe('Game files loader', function() {
        var done;

        it('is able to load json files', function() {
            var eventWorks = false;
            game.loader.on('json/engine/test/res/testTile.json', function() {
                eventWorks = true;
            });

            runs(function() {
                var that = this;
                game.load('engine/test/res/testTile', 'json', function(tile) {
                    that.tile = tile;
                    done = true;
                });
            });

            waitsFor(function() {
                return done;
            });

            runs(function () {
                expect(this.tile.id).toBeDefined();
                expect(this.tile.type).toEqual('tile');

                // check, if proper event was fired
                expect(eventWorks).toBeTruthy();

                // this is situation, when loaded file is in cache
                // and should be delivered immidiately
                game.load('engine/test/res/testTile', 'json', function(tileCache) {
                    expect(tileCache.id).toBeDefined();
                    expect(tileCache.type).toEqual('tile');
                });
            });
        });

        /*it('is able to load image files', function() {
            runs(function() {
                var that = this;
                game.load('engine/test/res/terrain_atlas.png', 'image', function(image) {
                    that.image = image;
                    done = true;
                });
            });

            waitsFor(function() {
                return done;
            });

            runs(function () {
                expect(this.image).toBeDefined();
            });
        });*/
    });
});