import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { dropTask, restartableTask, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import UserRegistration from 'ember-osf-web/models/user-registration';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SignUpForm extends Component {
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

    @alias('userRegistration.validations.attrs') a!: object;

    @and(
        'a.fullName.isValid',
        'a.email1.isValid',
        'a.email2.isValid',
        'a.password.isValid',
        'a.acceptedTermsOfService.isValid',
    ) formIsValid!: boolean;

    @dropTask
    async submitTask() {
        const { validations } = await this.userRegistration.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        try {
            await this.userRegistration.save();
        } catch (e) {
            // Handle email already exists error
            if (+e.errors[0].status === 409) {
                this.resetRecaptcha();
                this.userRegistration.addExistingEmail();
                await this.userRegistration.validate();
            } else if (+e.errors[0].status === 400) {
                this.resetRecaptcha();
                this.userRegistration.addInvalidEmail();
                await this.userRegistration.validate();
            }

            return;
        }

        this.set('hasSubmitted', true);
    }

    @restartableTask
    async strength(value: string) {
        if (!value) {
            return 0;
        }

        await timeout(250);

        return await this.passwordStrength.strength(value);
    }

    @computed('userRegistration.password', 'strength.lastSuccessful.value.score')
    get progress(): number {
        const { lastSuccessful } = taskFor(this.strength);
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

    init() {
        this.set('userRegistration', this.store.createRecord('user-registration'));
        if (this.campaign) {
            this.userRegistration.set('campaign', this.campaign);
        }
        return super.init();
    }

    @action
    submit() {
        taskFor(this.submitTask).perform();
    }
}
