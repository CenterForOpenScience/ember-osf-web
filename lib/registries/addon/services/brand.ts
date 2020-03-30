import Service, { inject as service } from '@ember/service';
import DS from 'ember-data';

import { tracked } from '@glimmer/tracking';

import Brand from 'ember-osf-web/models/brand';

export default class BrandService extends Service {
    @tracked currentBrand: Brand | null = null;
    @service store!: DS.Store;

    // XXX Should this happen in some application route?
    fetchBrand(providerId = 'osf') {
        // Fetch brand
        // where does provider id come from?
        return this.store.findRecord('registration-provider', providerId, { include: 'brand' }).then(provider => {
            this.setBrand(provider.belongsTo('brand').value() as Brand);
            return this.currentBrand;
        });
    }

    setBrand(brand: Brand | null) {
        this.currentBrand = brand;
    }
}
