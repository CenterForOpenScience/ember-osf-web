import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import Analytics from 'ember-osf-web/services/analytics';

@requireAuth()
export default class RegistriesMyRegistrationsRoute extends Route {
    @service analytics!: Analytics;
    @service router!: RouterService;

    constructor(...args: any[]) {
        super(...args);

        this.router.on('routeDidChange', () => {
            this.analytics.trackPage();
        });
    }
}
