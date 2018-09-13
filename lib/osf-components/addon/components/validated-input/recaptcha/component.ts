import { action, computed } from '@ember-decorators/object';
import Ember from 'ember';
import BaseValidatedComponent from '../base-component';
import layout from './template';

export default class ValidatedRecaptcha extends BaseValidatedComponent {
    layout = layout;

    @computed
    get isTesting(): boolean {
        // Don't render the recaptcha widget durring testing
        // as it causes random failures due to a delayed promise failure
        return Ember.testing;
    }

    @action
    onCaptchaResolved(this: ValidatedRecaptcha, reCaptchaResponse: string) {
        this.set('value', reCaptchaResponse);
    }

    @action
    onCaptchaExpired(this: ValidatedRecaptcha) {
        this.set('value', '');
    }
}
