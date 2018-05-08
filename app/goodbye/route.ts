import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import Session from 'ember-simple-auth/services/session';

export default class Goodbye extends Route {
    @service session!: Session;

    async beforeModel(this: Goodbye, transition: Ember.Transition) {
        await super.beforeModel(transition);
        transition.abort();
        const queryParams = this.session.isAuthenticated ? {} : { goodbye: true };
        this.transitionTo('home', { queryParams });
    }
}
