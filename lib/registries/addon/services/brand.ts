import Service from '@ember/service';

import { tracked } from '@glimmer/tracking';

import Brand from 'ember-osf-web/models/brand';

export default class BrandService extends Service {
    @tracked currentBrand: Brand | null = null;

    setBrand(brand: Brand | null) {
        this.currentBrand = brand;
    }
}
