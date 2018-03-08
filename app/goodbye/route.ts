import Route from '@ember/routing/route';

export default class DashboardUnauth extends Route.extend({
    session: service('session'),

    async beforeModel(...args) {
        await this._super(...args);

        if (this.get('session.isAuthenticated')) {
            this.transitionTo('dashboard');
        }
    },
}) {
    // normal class body definition here
}
