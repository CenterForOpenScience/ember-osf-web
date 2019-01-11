import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Session from 'ember-simple-auth/services/session';

import DashboardController from 'ember-osf-web/dashboard/controller';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';

@requireAuth('home')
export default class Dashboard extends Route {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service ready!: Ready;
    @service session!: Session;

    async setupController(this: Dashboard, controller: DashboardController): Promise<void> {
        const blocker = this.get('ready').getBlocker();

        try {
            await controller.get('setupTask').perform();
            blocker.done();
        } catch (e) {
            blocker.errored(e);
        }
    }

    @action
    didTransition(this: Dashboard) {
        this.analytics.trackPage();
    }
}
