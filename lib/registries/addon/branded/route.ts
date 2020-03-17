import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import RSVP from 'rsvp';

import Analytics from 'ember-osf-web/services/analytics';
import Brand from 'registries/services/brand';

export default class BrandedRegistriesRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service brand!: Brand;

    model(params: { providerId: string }) {
        return RSVP.hash({
            registrationProvider: this.store.findRecord('registration-provider', params.providerId),
            brand: this.store.findRecord('brand', '1'), // Maybe not the right way to fetch?
        });
    }

    afterModel(model: any) {
        this.brand.setBrand(model.brand);
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
