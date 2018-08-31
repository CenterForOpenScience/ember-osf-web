import { action } from '@ember-decorators/object';
import BaseValidatedComponent from '../base-component';
import layout from './template';

export default class ValidatedRecaptcha extends BaseValidatedComponent {
    layout = layout;

    @action
    onCaptchaResolved(this: ValidatedRecaptcha, reCaptchaResponse: string) {
        this.set('value', reCaptchaResponse);
    }

    @action
    onCaptchaExpired(this: ValidatedRecaptcha) {
        this.set('value', '');
    }
}
