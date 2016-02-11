var webpack = require('webpack'),
    lookupdirs = require('./lookup.dirs').build,
    path = require('path'),
    fs = require('fs');

fs.exists(path.join(__dirname, '/../local.config.js'), function(exist) {
    if (!exist) {
        fs.closeSync(fs.openSync(path.join(__dirname, '/../local.config.js'), 'w+'));
    }
});

module.exports = {
    context: path.join(__dirname + '/..'),
    entry: {
        'index': './source/app.js'
    },
    output: {
        path: path.join(__dirname, '/../build/js'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        loaders: [
            {test: /\.html$/, loader: 'ehogan'},
            {test: /\.js$/, loader: 'babel'}
        ]
    },
    resolve: {
        root: lookupdirs
    },
    devtool: 'source-map',
    debug: true,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'common',
                                filename: 'common.js',
                                minChunks: 2}),
        new webpack.optimize.DedupePlugin()
    ]
}
