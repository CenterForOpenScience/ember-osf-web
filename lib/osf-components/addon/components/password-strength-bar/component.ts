import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

interface Strength {
    score: number;
    feedback: {
        warning: string;
    };
}

@layout(template, styles)
export default class PasswordStrengthBar extends Component {
    // Required parameters
    password!: string;

    // Optional parameters
    shouldShowMessages: boolean = true;
    minStrength: number = 2;

    // Private properties
    @service passwordStrength!: PasswordStrength;

    @alias('checkStrength.lastSuccessful.value') strength?: Strength;

    @task({ withTestWaiter: true, restartable: true })
    checkStrength = task(function *(this: PasswordStrengthBar, value: string) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        return yield this.passwordStrength.strength(value);
    });

    @computed('password', 'strength', 'strength.score')
    get progress() {
        return this.password && this.strength ? 1 + this.strength.score : 0;
    }

    @computed('strength', 'strength.score', 'minStrength')
    get valid() {
        return this.strength && this.strength.score >= this.minStrength;
    }

    @computed('strength', 'strength.feedback.warning', 'valid')
    get message() {
        if (this.strength) {
            if (this.strength.feedback.warning) {
                return this.strength.feedback.warning;
            }
            if (!this.valid) {
                return 'Password is too weak.';
            }
        }
        return '';
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

    didUpdateAttrs() {
        this.checkStrength.perform(this.password);
    }
}
