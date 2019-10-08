import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Analytics from 'ember-osf-web/services/analytics';

export default class DraftFormRoute extends Route {
    @service analytics!: Analytics;

    model(this: DraftFormRoute) {
        return this.modelFor('drafts.draft');
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
