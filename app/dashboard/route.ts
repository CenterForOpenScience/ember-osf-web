import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Dashboard extends Route.extend({
    session: service('session'),
    analytics: service(),
    currentUser: service('currentUser'),

    async beforeModel(transition) {
        await this._super(transition);

        if (!this.get('session.isAuthenticated')) {
            transition.abort();
            this.transitionTo('home');
        }
    },

    model(this: Dashboard, params, transition) {
        const trans = transition;
        const page = trans.intent.url;
        const title = trans.targetName;
        const publicPrivate = 'n/a';
        const resourceType = 'n/a';
        this.get('analytics').trackPage(page, title, publicPrivate, resourceType);
    },
}) { }
