
var testFiles = [
    '/base/js/engine/test/Game.js',
    '/base/js/engine/test/Points.js',
    '/base/js/engine/test/Entity.js'
];

require.config({
    // Testacular serves files under /base, which is the basePath from your config file
    baseUrl: 'base/js',

    paths: {
        'css': 'libs/css',
        'i18n': '../components/requirejs-i18n/i18n',
        'domReady': '../components/requirejs-domready/domReady',
        'order': '../components/requirejs-plugins/lib/order',
        'text': '../components/requirejs-plugins/lib/text',
        'image': '../components/requirejs-plugins/src/image',
        'json': '../components/requirejs-plugins/src/json'
    },

    // dynamically load all test files
    deps: testFiles,

    // we have to kick of jasmine, as it is asynchronous
    callback: window.__testacular__.start
});

