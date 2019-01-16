import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import Session from 'ember-simple-auth/services/session';

import Analytics from 'ember-osf-web/services/analytics';

export default class Register extends Route {
    @service analytics!: Analytics;
    @service session!: Session;

    async beforeModel(this: Register, transition: Transition) {
        await super.beforeModel(transition);

        if (this.session.isAuthenticated) {
            this.transitionTo('dashboard');
        }
    }

    model() {
        return this.store.createRecord('user-registration');
    }

    @action
    didTransition(this: Register) {
        this.analytics.trackPage();
    }
}
