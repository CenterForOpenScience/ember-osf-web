import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Dashboard extends Route.extend({
    session: service('session'),
    analytics: service(),
    currentUser: service('current-user'),
    router: service(),
    actions: {
        didTransition(this: Dashboard) {
            const page = this.get('router').currentUrl;
            const title = this.get('routeName');
            this.get('analytics').trackPage(page, title);
        },
    },

    async beforeModel(transition) {
        await this._super(transition);

        if (!this.get('session.isAuthenticated')) {
            transition.abort();
            this.transitionTo('home');
        }
    },
}) { }
