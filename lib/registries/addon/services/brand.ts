import Service from '@ember/service';
import Brand from 'ember-osf-web/models/brand';

export default class BrandService extends Service {
    currentBrand: Brand | null = null;

    setBrand(brand: Brand) {
        this.set('currentBrand', brand);
    }
}
