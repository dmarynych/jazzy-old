define(['src/Game', 'src/Point3D', 'src/Tile', 'async'], function(Game, Point3D, Tile, async) {
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

    describe('Map', function() {


        var map =
            [['testTile', 'testTile', 'testTile', 'testTile'],
                ['testTile', 'testTileUnWalkable', 'testTile', 'testTile'],
                ['testTile', 'testTileUnWalkable', 'testTile', 'testTile']];


        beforeEach(function() {
            game.map.updateWalkMap();
            game.map.clearMap();
        });

        it('is able to set map, from array', function() {
            var mapDone;
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

        it('loops tiles', function() {
            var mapDone;
            game.setMap(map, function() {
                mapDone = true;
            });

            waitsFor(function() {
                return mapDone;
            });

            runs(function () {
                var i = 0;
                game.map.eachVisibleTile(function(tile) {
                    i++
                });
                expect(i).toBe(12);
            });
        });

        it('does pathfinding well', function() {
            var mapDone;
            game.setMap(map, function() {
                mapDone = true;
            });

            waitsFor(function() {
                return mapDone;
            });

            runs(function () {
                expect(game.map.tiles.length).toBe(12);
                var path = game.map.getPath(new Point3D(0, 2), new Point3D(2, 2));

                expect(path.numSteps).toBe(5);
            });
        });

    });
});