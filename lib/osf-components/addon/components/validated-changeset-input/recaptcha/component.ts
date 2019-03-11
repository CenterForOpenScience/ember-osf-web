import { action, computed } from '@ember-decorators/object';
import Ember from 'ember';

import { layout } from 'ember-osf-web/decorators/component';
import BaseValidatedComponent from '../base-component';
import template from './template';

export interface GRecaptcha {
    resetReCaptcha(): void;
}

@layout(template)
export default class ValidatedRecaptcha extends BaseValidatedComponent {
    // Exposes a reset action the the parent scope.
    // Usage: `bindReset=(action (mut this.resetRecaptcha))`, then call `this.resetRecaptcha()` to trigger a reset
    bindReset?: (action: () => void) => void;

    gRecaptcha!: GRecaptcha;

    constructor(...args: any[]) {
        super(...args);
        if (this.bindReset) {
            this.bindReset(this._reset.bind(this));
        }
    }

    @computed
    get isTesting(): boolean {
        // Don't render the recaptcha widget durring testing
        // as it causes random failures due to a delayed promise failure
        return Ember.testing;
    }

    @action
    _reset() {
        this.set('value', '');
        this.gRecaptcha.resetReCaptcha();
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
