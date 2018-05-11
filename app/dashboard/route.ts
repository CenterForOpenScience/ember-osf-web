import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import config from 'ember-get-config';
import Session from 'ember-simple-auth/services/session';

import DashboardController from 'ember-osf-web/dashboard/controller';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';

// TODO pull these from the database
const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

@requireAuth('home')
export default class Dashboard extends Route {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service ready!: Ready;
    @service session!: Session;

    async setupController(this: Dashboard, controller: DashboardController): Promise<void> {
        const blocker = this.get('ready').getBlocker();
        controller.set('filter', null);

        try {
            await Promise.all([
                controller.get('findNodes').perform(),
                controller.get('getInstitutions').perform(),
                controller.get('getPopularAndNoteworthy').perform(popularNode, 'popular'),
                controller.get('getPopularAndNoteworthy').perform(noteworthyNode, 'noteworthy'),
            ]);

            blocker.done();
        } catch (e) {
            blocker.errored(e);
        }
    }

    @action
    didTransition(this: Dashboard) {
        this.get('analytics').trackPage();
    }
}
