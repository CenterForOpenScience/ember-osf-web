import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import DS from 'ember-data';
import Analytics from 'ember-osf-web/services/analytics';
import Session from 'ember-simple-auth/services/session';

export default class Register extends Route {
    @service analytics!: Analytics;
    @service session!: Session;
    @service store!: DS.Store;

    async beforeModel(this: Register, transition: Ember.Transition) {
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
        this.get('analytics').trackPage();
    }
}
