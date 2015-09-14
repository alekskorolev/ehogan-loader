var loaderUtils = require('loader-utils');
var Hogan = require('hogan.js');
var minifier = require('html-minifier');

// https://github.com/kangax/html-minifier#options-quick-reference
var minifierDefaults = {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    caseSensitive: true
};

// :)
var extend = function(target, source) {
    'use strict';
    target = JSON.parse(JSON.stringify(target));

    Object.keys(source).forEach(function(key) {
        target[key] = source[key];
    });

    return target;
};

module.exports = function(source) {
    'use strict';
    var query = loaderUtils.parseQuery(this.query);

    if (this.cacheable) {
        this.cacheable();
    }

    // minify?
    if (query.minify) {
        // `?minify`
        var minifierOptions = minifierDefaults;

        // `?{minify:{...}}`
        if (Object.prototype.toString.call(query.minify) === '[object Object]') {
            minifierOptions = extend(minifierOptions, query.minify);
        }

        source = minifier.minify(source, minifierOptions);
    }

    var suffix;

    if (query.noShortcut) {
        suffix = 'return T; }();';
    } else {
        suffix = 'return T.render.apply(T, arguments); };';
    }
    var replaced = {};
    var vdata = source.replace(/\{\{(.+?)\}\}/gi, function(full, matched, pos, string) {
        var repl;
        repl = (matched.indexOf('_(')<0)?false:"{{ $$$"+pos+"$$$ }}";
        if (repl) {
            //console.log(repl);
            replaced[pos] = matched;
        }
        return repl || full;
    });
    var compile = 'var H = require("hogan.js");\n' +
           'module.exports = function() { ' +
           'var T = new H.Template(' +
           Hogan.compile(vdata, { asString: true }) +
           ', ' +
           JSON.stringify(vdata) +
           ', H);' + suffix;
    var compile = compile.replace(/t\.f\(\"\$\$\$(\d+)\$\$\$\"\,c\,p\,0\)/gi, function(full, matched, pos, string) {
        'use strict';
        var source = replaced[matched];
        var percentPos = source.indexOf(' % ');
        var str = percentPos<0?source:source.substring(0,percentPos);
        str = str.replace(/\|\w+$/gi, '');
        var data = percentPos<0?false:source.substring(percentPos+3, source.length);
        str = str.replace(/\_\(\'(.+)\'\)/gi, 'gettext("$1")');
        if (data) {
            data = data.replace(/\|\w+([\,\}])/gi, '$1');
            data = data.replace(/\: ([^\']+)([\,\}]) /gi, ': p.$1$2');
            str = 'compile('+str+', '+data+')';
        }
        return str;
    })
    return compile;
};
