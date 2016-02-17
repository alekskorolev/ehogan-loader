import testTemplate from './template.html';
import testTemplate1 from './template1.html';

var render = function(context = {}) {
    document.querySelector('body').append(testTemplate(context))
    //$('body').append(testTemplate(context));
    //$('body').append(testTemplate1(context));
}

export default render;
