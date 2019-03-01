import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { ChangesetDef } from 'ember-changeset/types';
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
    model!: ChangesetDef;
    valuePath!: string;

    // Private parameters
    @service passwordStrength!: PasswordStrength;
    message: string = '';
    strengthMessage: string = '';
    shouldShowMessage: boolean = false;

    strength = task(function *(this: PasswordStrengthBar, value: string) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        return yield this.passwordStrength.strength(value);
    }).restartable();

    @computed('password', 'strength.lastSuccessful.value.score', 'model.password.isValidating')
    get progress(this: PasswordStrengthBar): number {
        const { lastSuccessful } = this.strength;
        if (lastSuccessful && lastSuccessful.value && !this.model.get('password.isValidating')) {
            this.set('shouldShowMessage', !this.model.get('errors')[0]);
            this.set('message', lastSuccessful.value.feedback.warning);
        }
        return this.password && lastSuccessful ? 1 + lastSuccessful.value.score : 0;
    }

    @computed('progress')
    get progressStyle(): string {
        switch (this.progress) {
        case 1:
            this.set('strengthMessage', 'Very weak');
            return 'danger';
        case 2:
            this.set('strengthMessage', 'Weak');
            return 'danger';
        case 3:
            this.set('strengthMessage', 'So-so');
            return 'warning';
        case 4:
            this.set('strengthMessage', 'Good');
            return 'success';
        case 5:
            this.set('strengthMessage', 'Great!');
            return 'success';
        default:
            return 'none';
        }
    }

    didUpdateAttrs(this: PasswordStrengthBar) {
        this.strength.perform(this.get('password'));
    }
}
