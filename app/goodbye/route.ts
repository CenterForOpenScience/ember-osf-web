import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DashboardUnauth extends Route.extend({
    session: service('session'),

    async beforeModel(transition) {
        await this._super(transition);

        const session = this.get('session');

        if (session.get('isAuthenticated')) {
            await session.invalidate();
        }

        transition.abort();
        this.transitionTo('home', {
            queryParams: { goodbye: true },
        });
    },
}) {}
