import Service from '@ember/service';
import Brand from 'ember-osf-web/models/brand';

export default class BrandService extends Service {
    currentBrand: Brand? = null;

    setBrand(brand: Brand) {
        this.set('currentBrand', brand);
        this.setCssVariables();
    }

    setCssVariables() {
        if (!this.currentBrand) {
            return;
        }

        const documentStyle = document.documentElement.style;

        documentStyle.setProperty('--primary-color', this.currentBrand.primaryColor);
        documentStyle.setProperty('--secondary-color', this.currentBrand.secondaryColor);
        documentStyle.setProperty('--navbar-logo-img-url', this.currentBrand.navbarLogoImage);
        documentStyle.setProperty('--hero-logo-img-url', this.currentBrand.heroLogoImage);
        documentStyle.setProperty('--hero-background-img-url', this.currentBrand.heroBackgroundImage);
    }
}
