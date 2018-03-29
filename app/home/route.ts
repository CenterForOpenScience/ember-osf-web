import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Home extends Route.extend({
    analytics: service(),
    session: service(),

    async beforeModel(transition) {
        await this._super(transition);

        if (this.get('session.isAuthenticated')) {
            transition.abort();
            this.transitionTo('dashboard');
        }
    },

    setupController(...args) {
        const [controller] = args;

        controller.setProperties({
            didValidate: false,
        });

        this._super(...args);
    },
    actions: {
        didTransition(this: Home) {
            this.get('analytics').trackPage();
        },
    },
}) {
    model() {
        return this.store.createRecord('user-registration');
    }
}
