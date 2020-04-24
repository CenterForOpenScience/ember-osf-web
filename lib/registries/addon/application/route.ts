import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import config from 'ember-get-config';

import Analytics from 'ember-osf-web/services/analytics';
import BrandService from 'registries/services/brand';

import BrandModel from 'ember-osf-web/models/brand';

import RegistrationProvider from 'ember-osf-web/models/registration-provider';

const {
    OSF: {
        osfRegistrationProviderId,
    },
} = config;

export default class ApplicationRoute extends Route {
    @service analytics!: Analytics;

    @service store!: DS.Store;

    @service brand!: BrandService;

    model() {
        return this.store.findRecord('registration-provider', String(osfRegistrationProviderId), { include: 'brand' });
    }

    afterModel(model: RegistrationProvider) {
        this.brand.setBrand(model.belongsTo('brand').value() as BrandModel);
    }
}
