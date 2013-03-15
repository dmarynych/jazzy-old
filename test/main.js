
var testFiles = [
    '/base/test/Game.js',
    '/base/test/Points.js',
    '/base/test/Entity.js',
    '/base/test/Map.js'
];

require.config({
    // Testacular serves files under /base, which is the basePath from your config file
    baseUrl: 'base/',

    paths: {
        'i18n': 'components/requirejs-i18n/i18n',
        'domReady': 'components/requirejs-domready/domReady',
        'order': 'components/requirejs-plugins/lib/order',
        'text': 'components/requirejs-plugins/lib/text',
        'image': 'components/requirejs-plugins/src/image',
        'json': 'components/requirejs-plugins/src/json',
        'pathfinding': 'components/PathFinding.js/lib/pathfinding-browser',

        'async': 'components/async/lib/async'
    },

    // dynamically load all test files
    deps: testFiles,

    // we have to kick of jasmine, as it is asynchronous
    callback: window.__testacular__.start
});

