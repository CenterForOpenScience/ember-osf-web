import { inject as service } from '@ember/service';
import BaseValidator from 'ember-cp-validations/validators/base';
import DS from 'ember-data';

const PasswordStrength = BaseValidator.extend({
    passwordStrength: service('passwordStrength'),

    async validate(value: string, { min = 0 }, model: DS.Model, attribute: string) {
        const {
            feedback: {
                warning,
            },
            score,
        } = await this.get('passwordStrength').strength(value || '');

        return score >= min || warning;
    },
});

PasswordStrength.reopenClass({
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
    getDependentsFor(attribute: string, options: object): any[] {
        return [];
    },
});

export default PasswordStrength;
