import render from '../index';
import $ from 'jquery';

import {expect} from 'chai';

describe('Template render', () => {
    it('should be imported and correctly call', () => {
        expect(render).to.be.a('function');
        render({a: 'test string', b: 'untest'});
        expect($('body').html()).to.be.contain('test string');
        expect($('body').html()).to.be.contain('kzjhbgkjldfhgkdsf');
        expect(window.jscAdd).to.be.a('function');
    });
});
