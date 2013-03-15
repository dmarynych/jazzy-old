define(['src/Game', 'src/Map', , 'src/Tile'], function(Game, Map, Tile) {
    $('<div id="testmap"></div>').appendTo('body');

    var container = document.getElementById('testmap'),
        game = new Game({
            container: container,
            fps: 60,
            width: 960,
            height: 480,
            tilesPath: '/base/test/res/',
            imagesPath: '/base/test/res/'
        });


    game.start();


    describe('Game', function() {
        it('should initialize map', function() {
            expect(game.map instanceof Map).toBe(true);
        });

    });


    describe('Game files loader', function() {
        var loadDone, mapDone;

        it('is able to load json files', function() {
            var eventWorks = false;
            game.loader.on('json/test/res/testTile.json', function() {
                eventWorks = true;
            });

            runs(function() {
                var that = this;
                game.load('test/res/testTile', 'json', function(tile) {
                    that.tile = tile;
                    loadDone = true;
                });
            });

            waitsFor(function() {
                return loadDone;
            });

            runs(function () {
                expect(this.tile.id).toBeDefined();
                expect(this.tile.type).toEqual('tile');

                // check, if proper event was fired
                expect(eventWorks).toBeTruthy();

                // this is situation, when loaded file is in cache
                // and should be delivered immidiately
                game.load('test/res/testTile', 'json', function(tileCache) {
                    expect(tileCache.id).toBeDefined();
                    expect(tileCache.type).toEqual('tile');
                });
            });
        });

        it('is able to set map, from array', function() {
            var eventWorks = false;

            var map =
                [['testTile', 'testTile', 'testTile', 'testTile'],
                ['testTile', 'testTileUnWalkable', 'testTile', 'testTile'],
                ['testTile', 'testTileUnWalkable', 'testTile', 'testTile']];

                game.setMap(map, function() {
                    mapDone = true;
                });

                waitsFor(function() {
                    return mapDone;
                });

                runs(function () {
                    expect(game.map.tiles.length).toBe(12);
                });
        });


    });
});