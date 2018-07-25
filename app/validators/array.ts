import EmberObject, { get } from '@ember/object';
import BaseValidator from 'ember-cp-validations/validators/base';

interface Options extends EmberObject {
    minLength?: number;
}

const ArrayValidator = BaseValidator.extend({
    validate<T>(value: T[], options: Options): string | true {
        const minLength = get(options, 'minLength');

        if (minLength && value.length < minLength) {
            return this.createErrorMessage('minLength', value, options);
        }

        return true;
    },
});

ArrayValidator.reopenClass({
    /**
     * Define attribute specific dependent keys for your validator
     *
     * [
     *     `model.array.@each.${attribute}` --> Dependent is created on the model's context
     *     `${attribute}.isValid` --> Dependent is created on the `model.validations.attrs` context
     * ]
     *
     * @param {String} attribute The attribute being evaluated
     * @return {Array}
     */
    getDependentsFor(attribute: string): string[] {
        return [`model.${attribute}.length`];
    },
});

export default ArrayValidator;
