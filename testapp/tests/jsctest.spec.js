import {jscAdd, render} from '../jsctest';
import $ from 'jquery';

import {expect} from 'chai';

describe('Template render', () => {
    it('should be imported and correctly call', () => {
        expect(jscAdd).to.be.a('function');
        expect(window.jscAdd).to.be.a('function');
        render();
        expect($('body').html()).to.be.contain('this.is.a.test.component');
        expect($('body').html()).to.be.contain('this.is.a.test1.component');
    });
});
