import Model from '@ember-data/model';
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { isEmpty, isEqual, isPresent } from '@ember/utils';
import BaseValidator from 'ember-cp-validations/validators/base';

interface Options {
    allowBlank: boolean;
    on: string;
}

const Mismatch = BaseValidator.extend({
    validate(value: string, options: Options, model: Model, attribute: string): string | true {
        const on: any = get(options, 'on');
        const allowBlank: boolean = get(options, 'allowBlank');

        assert(`[validator:mismatch] [${attribute}] option 'on' is required`, isPresent(on));

        if (allowBlank && isEmpty(value)) {
            return true;
        }

        if (isEqual(value, get(model, on))) {
            return this.createErrorMessage('mismatch', value, options);
        }

        return true;
    },
});

Mismatch.reopenClass({
    /**
     * Define attribute specific dependent keys for your validator
     *
     * [
     *     `model.array.@each.${attribute}` --> Dependent is created on the model's context
     *     `${attribute}.isValid` --> Dependent is created on the `model.validations.attrs` context
     * ]
     *
     * @param {String} attribute The attribute being evaluated
     * @param {Unknown} options  Options passed into your validator
     * @return {Array}
     */
    getDependentsFor(attribute: string, options: Options): string[] {
        const on = get(options, 'on');

        assert(`[validator:mismatch] [${attribute}] 'on' must be a string`, typeof on === 'string');

        return on ? [`model.${on}`] : [];
    },
});

export default Mismatch;
