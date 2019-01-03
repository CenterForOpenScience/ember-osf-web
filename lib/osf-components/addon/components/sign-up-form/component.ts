import { action, computed } from '@ember-decorators/object';
import { alias, and } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import UserRegistration from 'ember-osf-web/models/user-registration';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SignUpForm extends Component.extend({
    submitTask: task(function *(this: SignUpForm) {
        const { validations } = yield this.userRegistration.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        try {
            yield this.userRegistration.save();
        } catch (e) {
            // Handle email already exists error
            if (+e.errors[0].status === 409) {
                this.resetRecaptcha();
                this.userRegistration.addExistingEmail();
                yield this.userRegistration.validate();
            } else if (+e.errors[0].status === 400) {
                this.resetRecaptcha();
                this.userRegistration.addInvalidEmail();
                yield this.userRegistration.validate();
            }

            return;
        }

        this.set('hasSubmitted', true);
    }).drop(),
}) {
    // Optional parameters
    campaign?: string;

    // Private properties
    userRegistration!: UserRegistration;

    hasSubmitted: boolean = false;
    didValidate = false;
    resetRecaptcha!: () => void; // bound by validated-input/recaptcha

    @service passwordStrength!: PasswordStrength;
    @service analytics!: Analytics;
    @service store!: DS.Store;

    strength = task(function *(this: SignUpForm, value: string) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        return yield this.passwordStrength.strength(value);
    }).restartable();

    @computed('userRegistration.password', 'strength.lastSuccessful.value.score')
    get progress(this: SignUpForm): number {
        const { lastSuccessful } = this.strength;
        return this.userRegistration.password && lastSuccessful ? 1 + lastSuccessful.value.score : 0;
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

    @alias('userRegistration.validations.attrs') a!: object;

    @and(
        'a.fullName.isValid',
        'a.email1.isValid',
        'a.email2.isValid',
        'a.password.isValid',
        'a.acceptedTermsOfService.isValid',
    ) formIsValid!: boolean;

    init() {
        this.set('userRegistration', this.store.createRecord('user-registration'));
        if (this.campaign) {
            this.userRegistration.set('campaign', this.campaign);
        }
        return super.init();
    }

    @action
    submit() {
        this.submitTask.perform();
    }
}
