import { attribute, layout } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

@layout(hbs`{{yield this.yieldValue}}`)
export default class Dummy extends Component {
    static DATA_ATTR_REGEX = /^data-(?!test-).+$/;

    yieldValue!: any;
    @attribute role!: string;
    @attribute href!: string;
    @alias('click') onclick!: () => void;

    constructor(...args: any[]) {
        super(...args);

        const dataAttrs = [];
        for (const attr in this) { // eslint-disable-line no-restricted-syntax
            if (Dummy.DATA_ATTR_REGEX.test(attr)) {
                dataAttrs.push(attr);
            }
        }

        this.set('attributeBindings', this.attributeBindings.concat(dataAttrs));
    }
}
