import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task, timeout } from 'ember-concurrency';
import { layout } from 'ember-osf-web/decorators/component';
import UserPassword from 'ember-osf-web/models/user-password';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class PasswordStrengthBar extends Component {
    // Required parameters
    password!: UserPassword;

    // Private parameters
    @service passwordStrength!: PasswordStrength;
    message: string = '';

    strength = task(function *(this: PasswordStrengthBar, value: string) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        return yield this.passwordStrength.strength(value);
    }).restartable();

    @computed('password', 'strength.lastSuccessful.value.score')
    get progress(this: PasswordStrengthBar): number {
        const { lastSuccessful } = this.strength;
        if (lastSuccessful && lastSuccessful.value) {
            this.set('message', lastSuccessful.value.feedback.warning);
        }
        return this.password && lastSuccessful ? 1 + lastSuccessful.value.score : 0;
    }

    @computed('progress')
    get progressStyle(): string {
        switch (this.progress) {
        case 1:
        case 2:
            return 'danger';
        case 3:
            return 'warning';
        case 4:
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
