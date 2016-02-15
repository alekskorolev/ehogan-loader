var lookupdirs = require('./lookup.dirs').build,
    path = require('path'),
    fs = require('fs'),
    testModules = process.env.npm_config_tM ? '../modules/' + process.env.npm_config_tM + '/tests/**/*.spec.js' : '../**/tests/**/*.spec.js',
    coverage = process.env.npm_config_cV,
    reporters = ['progress'],
    loaders = [
        {test: /\.js$/, loader: 'babel'},
        {test: /\.html$/, loader: 'ehogan'}
    ];

if (coverage) {
    reporters.push('coverage');
    loaders.unshift({test: /^(?!.*(node_modules|test)).*\.js$/, loader: 'istanbul-instrumenter'});
}

fs.exists(path.join(__dirname, '/../local.config.js'), function(exist) {
    if (!exist) {
        fs.closeSync(fs.openSync(path.join(__dirname, '/../local.config.js'), 'w+'));
    }
});

module.exports = function (config) {
    config.set({

        basePath: '',

        frameworks: ['mocha'],
        client: {
          mocha: {
          }
        },
        files: [
            '../tests/**/*.spec.js',
        ],

        exclude: [
        ],
        reporters: reporters,

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        preprocessors: {
            '../**/*.spec.*': ['webpack']
        },
        webpack: {
            output: {
                path: 'build/'
            },
            devtool: 'source-map',
            debug: true,
            resolve: {
                root: lookupdirs
            },
            module: {
                loaders: loaders
            }
        },/*
        webpackMiddleware: {
            noInfo: true
        },*/
        coverageReporter: {
            dir : '../coverage/',
            reporters: [
                { type: 'html', subdir: 'html' }
            ]
        }
    })
}
