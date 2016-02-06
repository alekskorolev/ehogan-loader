## Hogan loader for [webpack](https://webpack.github.io/)

### Install

```sh
$ npm i -S ehogan-loader
```

### Usage

```javascript
module: {
    loaders: [ {
        test: /\.html$/,
        loader: 'ehogan'
        // loader: 'ehogan?minify'
        // loader: 'ehogan?{ minify: { removeComments: false } }'
        // loader: 'ehogan?noShortcut'
    } ]
}
```

```javascript
var template = require('./template.html');
var html = template({ foo: 'bar' });
```

If `noShortcut` is passed, then Hogan compiled template is returned instead, so
you can pass it as partial.

```javascript
var template = require('./template.html');
var template2 = require('./template2.html');
var html = template.render({ foo: 'bar' }, {partial: template2});
```

[Documentation: Using loaders](https://webpack.github.io/docs/using-loaders.html).

### Extended api

Localization api with sintax converted as gettext format and python like string interpolation support. 

```html
{{ _('%(string)s for translate') % {'variable': 'String'} }}
```
** need enabled library, released gettext & interpolate function, like as [muce.io](https://github.com/alekskorolev/muce.io).

### License

The MIT License (MIT)

Copyright (c) 2016 Aleksandr korolev <aleksandr@korolev.email>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.