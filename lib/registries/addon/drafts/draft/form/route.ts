import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Store from 'ember-data/store';
import Analytics from 'ember-osf-web/services/analytics';

export default class DraftsFormRoute extends Route {
    @service analytics!: Analytics;
    @service store!: Store;

    model() {
        return this.store.findRecord('registration-schema', 'as_predicted_preregsitration');
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
