import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

export default class Goodbye extends Route {
    @service session!: Session;

    async beforeModel(transition: Transition) {
        await super.beforeModel(transition);
        const queryParams = this.session.isAuthenticated ? {} : { goodbye: true };
        this.transitionTo('home', { queryParams });
    }
}
