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
hashKey = function() {
    "use strict";
    var d = new Date().getTime(),
        code = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
    return code;
}

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
    var strings = {};
    var vdata = source.replace(/\{\{(.+?)\}\}/gi, function(full, matched, pos, string) {
        var repl, comp, cOption, cId, cName, uId, rOptions;
        repl = (matched.indexOf('_(')<0)?false:"{{ ___"+pos+"___ }}";
        comp = !(repl || matched.indexOf('#(')<0);
        if (repl) {
            strings[pos] = matched;
        } else if (comp) {
            var cOption = matched.match(/\#\((\w+)\=(.+?)\)/);
            try {
                cName = cOption[1];
                cOption = JSON.parse(cOption[2]) || {};
            } catch(e) {
                cOption = {};
            }
            if (cName) {
                cId = cOption.id;
                rOptions = cOption.renderOptions.replace('%{', '{{').replace('}%', '}}');
                cOption.renderOptions = undefined;
                uId = hashKey();
                comp = '<span id="js-view-components-' + cName + '-' + uId + '" class="js-view-components-' + cName + '" data-component-id="' + cId + '"></span>' +
                       '<script type="text/javascript">' +
                            '(function(window) {' +
                                'window.components.initComponent("'+cName+'", "' + uId + '", ' + rOptions + ', ' + JSON.stringify(cOption) + ');' +
                                //'alert("' + cId + ' - ' + cName + '");' +
                            '})(window)' +
                       '</script>';
            } else {
                throw new Error('Component parse error \\' + matched + '\\');
            }
        }
        return repl || comp || full;
    });
    var compile = 'var H = require("hogan.js");\n' +
           'module.exports = function() { ' +
           'var T = new H.Template(' +
           Hogan.compile(vdata, { asString: true }) +
           ', ' +
           JSON.stringify(vdata) +
           ', H);' + suffix;
    var compile = compile.replace(/t\.f\(\"___(\d+)___\"\,c\,p\,0\)/gi, function(full, matched, pos, string) {
        'use strict';
        var source = strings[matched];
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
