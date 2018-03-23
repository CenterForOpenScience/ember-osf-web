import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Dashboard extends Route.extend({
    session: service('session'),

    async beforeModel(...args) {
        await this._super(...args);

        if (!this.get('session.isAuthenticated')) {
            this.transitionTo('home');
        }
    },
}) { }
