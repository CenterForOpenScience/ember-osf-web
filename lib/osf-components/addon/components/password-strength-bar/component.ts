import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task, timeout } from 'ember-concurrency';
import I18n from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

interface Strength {
    score: number;
    feedback: {
        warning: string;
    };
}

@layout(template, styles)
export default class PasswordStrengthBar extends Component.extend({
    checkStrength: task(function *(this: PasswordStrengthBar, value: string) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        return yield this.passwordStrength.strength(value);
    }).restartable(),
}) {
    // Required parameters
    password!: string;

    // Optional parameters
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);
    minStrength: number = defaultTo(this.minStrength, 2);

    // Private properties
    @service i18n!: I18n;
    @service passwordStrength!: PasswordStrength;

    @alias('checkStrength.lastSuccessful.value') strength?: Strength;

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
