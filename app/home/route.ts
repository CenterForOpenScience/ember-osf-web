import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Home extends Route.extend({
    session: service('session'),

    async beforeModel(...args) {
        await this._super(...args);

        if (this.get('session.isAuthenticated')) {
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
