import { attribute } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
export default class Dummy extends Component {
    // Note: this regex is crafted to avoid clashing
    // with ember-test-selectors
    static DATA_ATTR_REGEX = /^data-(?!test-).+$/;

    yieldValue!: any;
    @attribute role!: string;
    @attribute href!: string;
    @alias('click') onclick!: () => void;

    constructor(...args: any[]) {
        super(...args);

        // Inspired by ember-test-selectors with <3
        // https://github.com/simplabs/ember-test-selectors/blob/master/vendor/ember-test-selectors/patch-component.js
        const dataAttrs = [];
        for (const attr in this) { // eslint-disable-line no-restricted-syntax
            if (Dummy.DATA_ATTR_REGEX.test(attr)) {
                dataAttrs.push(attr);
            }
        }

        this.set('attributeBindings', this.attributeBindings.concat(dataAttrs));
    }
}
