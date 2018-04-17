import { service } from '@ember-decorators/service';
import BaseValidator from 'ember-cp-validations/validators/base';

export default class PasswordStrength extends BaseValidator {
    @service passwordStrength;

    async validate(this: PasswordStrength, value: string = '', { min = 0 }) {
        const {
            feedback: {
                warning,
            },
            score,
        } = await this.get('passwordStrength').strength(value);

        return score >= min || warning;
    }
}
