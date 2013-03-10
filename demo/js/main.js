require.config({
    baseUrl: "js/",
    paths: {
        'jquery': '../../components/jquery/jquery',
        'async': '../../components/async/dist/async.min',
        'underscore': '../../components/underscore/underscore',
        'jquery.hotkeys': '../../components/jquery.hotkeys/jquery.hotkeys',

        // requirejs plugins
        'css': 'libs/css',
        'i18n': '../../components/requirejs-i18n/i18n',
        'domReady': '../../components/requirejs-domready/domReady',
        'order': '../../components/requirejs-plugins/lib/order',
        'text': '../../components/requirejs-plugins/lib/text',
        'image': '../../components/requirejs-plugins/src/image',
        'json': '../../components/requirejs-plugins/src/json',


        // jazzy files
        'Entity': '../../src/Entity',
        'Animation': '../../src/Animation',
        'Game': '../../src/Game',
        'Map': '../../src/Map',
        'MovePath': '../../src/MovePath',
        'Point2D': '../../src/Point2D',
        'Point3D': '../../src/Point3D',
        'Sprite': '../../src/Sprite',
        'Tile': '../../src/Tile',
        'utils': '../../src/utils'
    },
    shim: {
        'jquery.hotkeys': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'globals': {
            deps: ['jquery']
        }
    },
    i18n: {
        locale: 'en-en'
    },
    urlArgs: "v="+ new Date().getTime()

});

require(
    ['demo', '../../src/EventEmitter', 'jquery', 'jquery.hotkeys', 'underscore', 'globals', 'domReady!'],
    function(td) {
        'use strict';

        td.init();
    });