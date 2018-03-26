import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Home extends Route.extend({
    session: service('session'),

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
}) {
    model() {
        return this.store.createRecord('user-registration');
    }
}
