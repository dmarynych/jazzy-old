define(['../../src/Game'], function(Game) {
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

            game.start();

            map = [
                ['grass2', 'grass3', 'grass1', 'grass1', 'grass1'],
                ['grass1', 'lake_lt', 'lake_tt', 'lake_tr', 'grass1'],
                ['grass1', 'lake_ll', 'water', 'lake_rr', 'grass1'],
                ['grass2', 'lake_bl', 'lake_bb', 'lake_rb', 'grass1'],
                ['grass2', 'grass3', 'grass1', 'grass1', 'grass3']
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
                pos: [4, 4]
            });

            game.events.on('keypress:left keypress:up keypress:right keypress:down', function(event, name) {
                var player = game.getEntity('player');
                player.startMovement(name);
            }.bind(this));

            game.events.on('keyup:left keyup:up keyup:right keyup:down', function(event, name) {
                var player = game.getEntity('player');
                player.stopMoving();
            }.bind(this));



        }
    };

    return demo;
});