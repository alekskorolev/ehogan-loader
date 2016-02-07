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
var hashKey = function() {
    "use strict";
    var d = new Date().getTime(),
        code = '-yxxx-yxxx'.replace(/[xy]/g, function (c) {
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
        suffix = 'return T[arguments[0] instanceof Array ? "ri" : "render"].apply(T, arguments); };';
    }
    var strings = {};
    // осторожно, не для слабонервных
    source = source.replace(/\<jsc\-([^\s]+)[^\w]*([^\>]*?)\>([\s\S]*?)(?:\<\/jsc\-\1\>)/gi, function(full, name, options, content, ccontent) {
        var opt = {}, component,
            uId = hashKey(),
            tagStart, initCode, tagEnd = '</span>',
            scriptStart = '<script type="text/javascript">(function() {',
            scriptEnd = '})()</script>';
        options.replace(/(.+?)=\"(.+?)\"\s?/gi, function(full, name, value, pos) {
            name=name.replace(/[\s]+/gi, '');
            if (opt.hasOwnProperty(name)) {
                if (opt[name] instanceof Array) {
                    opt[name].push(value);
                } else {
                    opt[name] = [opt[name], value];
                }
            } else {
                opt[name] = value;
            }
        });
        content = content.replace(/\n/gi, '');
        tagStart = '<span id="jsc-' + name + uId + '{{ parent-Id }}-' + ( opt.key || '') + '" class="jsc-' + name + (opt.cid && !opt.key?' jsc-' + name + '-' + opt.cid:'') + (opt.key?' jsc-' + name + '-' + opt.key:'') + '">';
        initCode = 'jscInit("-' + name + '", "' + uId + '{{ parent-Id }}-' + ( opt.key || '') + '", "{{ parent-uId }}", ' + JSON.stringify(opt) + (content?(", '" + content + "'"):'') + ')';
        component = tagStart + (opt['with-content']?content:'') + tagEnd + scriptStart + initCode + scriptEnd;
        return component;
    });
    var vdata = source.replace(/\{\{(.+?)\}\}/gi, function(full, matched, pos, string) {
        var repl, comp, cOption, cId, cName, uId, rOptions, cIdData;
        repl = (matched.indexOf('_(')<0)?false:"{{ ___"+pos+"___ }}";
        if (repl) {
            strings[pos] = matched;
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
    var compile = compile.replace(/t\.f\(\"___(\d+)___\"\,c\,p\,0\)/gi, function(full, matched, pos, string) {
        'use strict';
        var source = strings[matched];
        var named;
        var percentPos = source.indexOf(' % ');
        var str = percentPos<0?source:source.substring(0,percentPos);
        str = str.replace(/\|\w+$/gi, '');
        var data = percentPos<0?false:source.substring(percentPos+3, source.length);
        str = str.replace(/\_\(\'(.+)\'\)/gi, 'gettext("$1")');
        if (data) {
            data = data.replace(/\|\w+([\,\}])/gi, '$1');
            data = data.replace(/\: ([^\']+)([\,\}]) /gi, ': t.d("$1",c,p,1)||""$2');
            named = str.search(/\%\(.+?\)s/gi)>-1;
            str = 'interpolate(' + str + ', ' + data + ', ' + named + ')';
        }
        return str;
    })
    return compile;
};
