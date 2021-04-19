import Model from '@ember-data/model';
import { action, computed } from '@ember/object';
import Ember from 'ember';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

export interface GRecaptcha {
    resetReCaptcha(): void;
}

@layout(template)
export default class ValidatedRecaptcha<M extends Model> extends BaseValidatedComponent<M> {
    valuePath!: AttributesFor<M>;

    // Exposes a reset action the the parent scope.
    // Usage: `bindReset=(action (mut this.resetRecaptcha))`, then call `this.resetRecaptcha()` to trigger a reset
    bindReset?: (action: () => void) => void;

    gRecaptcha!: GRecaptcha;

    init() {
        super.init();
        if (this.bindReset) {
            this.bindReset(this._reset.bind(this));
        }
    }

    @computed()
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
    onCaptchaResolved(reCaptchaResponse: string) {
        this.set('value', reCaptchaResponse);
    }

    @action
    onCaptchaExpired() {
        this.set('value', '');
    }
}
