import { service } from '@ember-decorators/service';
import PasswordStrengthService from 'ember-cli-password-strength/services/password-strength';
import BaseValidator from 'ember-cp-validations/validators/base';

export default class PasswordStrength extends BaseValidator {
    @service passwordStrength!: PasswordStrengthService;

    async validate(this: PasswordStrength, value: string = '', { min = 0 }) {
        const {
            feedback: {
                warning,
            },
            score,
        } = await this.passwordStrength.strength(value);

        return score >= min || warning;
    }
}
