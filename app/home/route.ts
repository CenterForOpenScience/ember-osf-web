import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import Session from 'ember-simple-auth/services/session';

import Analytics from 'ember-osf-web/services/analytics';

export default class Home extends Route.extend({
    async beforeModel(this: Home, transition: Ember.Transition) {
        await this._super(transition);

        if (this.get('session').get('isAuthenticated')) {
            this.transitionTo('dashboard');
        }
    },

    setupController(...args: any[]) {
        const [controller] = args;

        controller.setProperties({
            didValidate: false,
        });

        this._super(...args);
    },
}) {
    @service analytics!: Analytics;
    @service session!: Session;

    model() {
        return this.store.createRecord('user-registration');
    }

    @action
    didTransition(this: Home) {
        this.get('analytics').trackPage();
    }
}
