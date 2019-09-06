import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Store from 'ember-data/store';
import Analytics from 'ember-osf-web/services/analytics';

export default class DraftsFormRoute extends Route {
    @service analytics!: Analytics;
    @service store!: Store;

    model() {
        return this.store.findRecord('registration-schema', 'testSchema', { include: 'schema_block' });
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
