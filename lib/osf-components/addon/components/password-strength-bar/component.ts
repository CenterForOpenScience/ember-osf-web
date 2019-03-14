import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task, timeout } from 'ember-concurrency';
import I18n from 'ember-i18n/services/i18n';
import { layout } from 'ember-osf-web/decorators/component';
import UserPassword from 'ember-osf-web/models/user-password';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class PasswordStrengthBar extends Component.extend({
    strength: task(function *(this: PasswordStrengthBar, value: string) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        return yield this.passwordStrength.strength(value);
    }).restartable(),
}) {
    // Required parameters
    password!: UserPassword;
    model!: UserPassword;

    // Private parameters
    @service i18n!: I18n;
    @service passwordStrength!: PasswordStrength;
    message: string = '';
    shouldShowMessage: boolean = false;
    @alias('model.validations.attrs.newPassword.message')
        hasValidationMessage!: boolean;
    @alias('model.validations.attrs.newPassword.isValidating')
        isValidating!: boolean;

    @computed('password', 'strength.lastSuccessful.value.score', 'hasValidationMessage')
    get progress(this: PasswordStrengthBar) {
        const { lastSuccessful } = this.strength;
        if (lastSuccessful && lastSuccessful.value && !this.isValidating) {
            this.set('shouldShowMessage', !this.hasValidationMessage);
            this.set('message', lastSuccessful.value.feedback.warning);
        }
        return this.password && lastSuccessful ? 1 + lastSuccessful.value.score : 0;
    }

    @computed('progress')
    get progressStyle(): string {
        switch (this.progress) {
        case 1:
            return 'danger';
        case 2:
            return 'danger';
        case 3:
            return 'warning';
        case 4:
            return 'success';
        case 5:
            return 'success';
        default:
            return 'none';
        }
    }

    didUpdateAttrs(this: PasswordStrengthBar) {
        this.strength.perform(this.get('password'));
    }
}
