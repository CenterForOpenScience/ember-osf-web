import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Dashboard extends Route.extend({
    session: service('session'),

    async beforeModel(transition) {
        await this._super(transition);

        if (!this.get('session.isAuthenticated')) {
            transition.abort();
            this.transitionTo('home');
        }
    },
}) { }
