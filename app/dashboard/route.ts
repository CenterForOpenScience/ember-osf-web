import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import config from 'ember-get-config';

// TODO pull these from the database
const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

export default class Dashboard extends Route.extend({
    async beforeModel(transition) {
        await this._super(transition);

        if (!this.get('session.isAuthenticated')) {
            transition.abort();
            this.transitionTo('home');
        }
    },
}) {
    @service analytics;
    @service currentUser;
    @service ready;
    @service session;

    async setupController(this: Dashboard, controller): Promise<void> {
        const blocker = this.get('ready').getBlocker();

        try {
            controller.set('filter', null);
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
