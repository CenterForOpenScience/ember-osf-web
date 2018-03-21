import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DashboardUnauth extends Route.extend({
    session: service('session'),

    async beforeModel(...args) {
        await this._super(...args);

        const session = this.get('session');

        if (session.get('isAuthenticated')) {
            await session.invalidate();
        }

        this.transitionTo('home', {
            queryParams: { goodbye: true },
        });
    },
}) {}
