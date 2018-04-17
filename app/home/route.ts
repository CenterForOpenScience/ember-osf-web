import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class Home extends Route.extend({
    async beforeModel(this: Home, transition) {
        await this._super(transition);

        if (this.get('session').get('isAuthenticated')) {
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
    @service analytics;
    @service session;

    model() {
        return this.store.createRecord('user-registration');
    }

    @action
    didTransition(this: Home) {
        this.get('analytics').trackPage();
    }
}
