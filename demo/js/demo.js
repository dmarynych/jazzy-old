define(['../../src/Game', './Point2D', 'jquery'], function(Game, Point2D) {
    'use strict';

    var demo = {
        init: function() {
            var container = document.getElementById('map_container'),
                game = new Game({
                    container: container,
                    fps: 60,
                    bgColor: '#2B8235',
                    width: 960,
                    height: 480
                }),
                map;

            var leftOffset = parseInt(($(document).width() - 960) / 2, 10);
            $('.ui').css({
                'left': leftOffset,
                width: 960,
                height: 480

            });

            game.start();

            map = [
                ['grass2', 'grass3', 'grass1', 'grass2', 'grass1', 'grass2', 'grass1', 'grass3'],
                ['grass1', 'lake_lt', 'lake_tt', 'lake_tr', 'grass1', 'grass1', 'grass2', 'grass2'],
                ['grass1', 'lake_ll', 'water', 'lake_rr', 'grass1', 'grass2', 'grass1', 'grass2'],
                ['grass2', 'lake_bl', 'lake_bb', 'lake_rb', 'grass1', 'grass2', 'grass3', 'grass1'],
                ['grass2', 'grass3', 'grass1', 'grass1', 'grass1', 'grass1', 'grass2', 'grass1'],
                ['grass1', 'grass1', 'grass1', 'grass2', 'grass1', 'grass2', 'grass1', 'grass2'],
                ['grass1', 'grass1', ['grass2', 'rock'], ['grass2', 'small_rocks'], 'grass3', 'grass1', 'grass2', 'grass1'],
                ['grass2', 'grass1', 'grass3', 'grass2', 'grass2', 'grass3', 'grass1', 'grass3'],
                ['grass2', 'grass3', 'grass1', 'grass1', 'grass3', 'grass2', 'grass2', 'grass2']
            ];

            game.setMap(map);

            /*game.addEntity({
                id: 'stump1',
                name: 'Stump',
                pos: [1, 2]
            });*/

            game.addEntity({
                id: 'player',
                name: 'Player',
                pos: [2, 4]
            });

            game.addEntity({
                id: 'skeleton',
                name: 'Skeleton',
                pos: [6, 4]
            });

            game.map.mainCanvas.on('click', function(e) {
                var point = new Point2D(e.offsetX, e.offsetY);
                game.getEntity('player').moveToPoint(point);

                return false;
            });

            game.map.mainCanvas.on('contextmenu', function(e) {
                var point = new Point2D(e.offsetX, e.offsetY),
                    skeleton = game.getEntity('skeleton'),
                    player = game.getEntity('player');

                player.castSpell('Fireball', skeleton);

                return false;
            });

            $(document)
                .bind('keydown', 'left', function() {
                    game.getEntity('player').startMovement('left');return false;
                })
                .bind('keydown', 'up', function() {
                    game.getEntity('player').startMovement('up');return false;
                })
                .bind('keydown', 'right', function() {
                    game.getEntity('player').startMovement('right');return false;
                })
                .bind('keydown', 'down', function() {
                    game.getEntity('player').startMovement('down');return false;
                })
                .bind('keyup', 'left', function() {
                    game.getEntity('player').stopMovement();return false;
                })
                .bind('keyup', 'up', function() {
                    game.getEntity('player').stopMovement();return false;
                })
                .bind('keyup', 'right', function() {
                    game.getEntity('player').stopMovement();return false;
                })
                .bind('keyup', 'down', function() {
                    game.getEntity('player').stopMovement();return false;
                })
                .bind('keydown', 'tab', function() {
                    fbug('tab');
                    return false;
                })
                .bind('keydown', '1', function() {
                    fbug(1)
                });
            /*game.keypress('keypress:left keypress:up keypress:right keypress:down', function(event, name) {
                var player = game.getEntity('player');
                player.startMovement(name);
            }.bind(this));

            game.events.on('keyup:left keyup:up keyup:right keyup:down', function(event, name) {
                var player = game.getEntity('player');
                player.stopMoving();
            }.bind(this));*/



        }
    };

    return demo;
});