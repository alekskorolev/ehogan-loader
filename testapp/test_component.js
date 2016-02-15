import _ from 'underscore';
import $ from 'jquery';

class TestComponent {
    constructor(options) {
        console.log(options)
        this.initialize(options);
    }
    initialize(options) {
        console.log(options)
        this.cId = options.id;
        this.uId = options.uId || '';
        this.data = options;
        this.render();
    }
    render() {
        var context,
            parent,
            rendered;

        parent = {
            'parent-uId': this.uId || '',
            'parent-name': this.name || ''
        };
        //context = _.extend(window.Settings || {}, this.data, parent);
        rendered = this.template([this.data, parent, window]);
        $(this.data.el).html(rendered);
        return rendered;
    }
    template() {
        return '<span>this.is.a.test.component</span>';
    }
}

export default TestComponent;
