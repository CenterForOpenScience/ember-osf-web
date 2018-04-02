import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Dashboard extends Route.extend({
    session: service('session'),
    analytics: service(),
    currentUser: service('current-user'),
    async beforeModel(transition) {
        await this._super(transition);

        if (!this.get('session.isAuthenticated')) {
            transition.abort();
            this.transitionTo('home');
        }
    },
    actions: {
        didTransition(this: Dashboard) {
            this.get('analytics').trackPage();
        },
    },

}) { }
