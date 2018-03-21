import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class Dashboard extends Route {
    @service session;

    async beforeModel(this: Dashboard, transition) {
        await this._super(transition);

        if (!this.get('session.isAuthenticated')) {
            transition.abort();
            this.transitionTo('home');
        }
    }

    setupController(this: Dashboard, controller) {
        controller.get('initialLoad').perform();
    }
}
