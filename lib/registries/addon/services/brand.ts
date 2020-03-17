import Service from '@ember/service';
import Brand from 'ember-osf-web/models/brand';

export default class BrandService extends Service {
    currentBrand = { primaryColor: '' };

    setBrand(brand: Brand) {
        this.set('currentBrand', brand);
        this.setCssVariables();
    }

    setCssVariables() {
        // set --primary-color variable
        // set --secondary-color variable
        document.documentElement.style.setProperty('--primary-color', this.currentBrand.primaryColor);
    }
}
