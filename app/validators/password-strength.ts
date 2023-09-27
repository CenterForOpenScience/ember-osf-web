import BaseValidator from 'ember-cp-validations/validators/base';
import zxcvbn from 'zxcvbn';


export default class PasswordStrength extends BaseValidator {
    async validate(value = '', { min = 0 }) {
        const {
            feedback: {
                warning,
            },
            score,
        } = zxcvbn(value);

        return score >= min || warning;
    }
}
