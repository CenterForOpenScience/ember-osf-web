import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';

export default class Institutions extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;

    model() {
        return this.store.findAll('institution');
    }

    didTransition(this: Institutions) {
        this.get('analytics').trackPage();
    }
}
