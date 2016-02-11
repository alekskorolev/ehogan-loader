import Template from './template.html';
import $ from 'jquery';

import jscAdd from 'ehogan-loader/jscmanager';

import testComponent from './test_component';
import testoComponent from './test_component1';

jscAdd(testComponent);
jscAdd(testoComponent);


var render = function(context = {}) {
    $('body').append(Template(context));
}

export {
    jscAdd,
    render
}
