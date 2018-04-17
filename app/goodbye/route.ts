import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class Goodbye extends Route.extend({
    async beforeModel(this: Goodbye, transition) {
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
}) {
    @service session;
}
