import { inject as service } from '@ember/service';
import BaseValidator from 'ember-cp-validations/validators/base';

const PasswordStrength = BaseValidator.extend({
    passwordStrength: service('passwordStrength'),

    async validate(value: string, { min = 0 }) {
        const {
            feedback: {
                warning,
            },
            score,
        } = await this.get('passwordStrength').strength(value || '');

        return score >= min || warning;
    },
});

export default PasswordStrength;
