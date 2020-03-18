import Modifier from 'ember-oo-modifiers';

import Brand from 'registries/services/brand';

import { inject as service } from '@ember/service';

class WithBrandingModifier extends Modifier {
    @service brand!: Brand;

    didInsertElement() {
        const elementStyle = this.element.style;
        const { currentBrand } = this.brand;

        if (currentBrand) {
            elementStyle.setProperty('--primary-color', currentBrand.get('primaryColor'));
            elementStyle.setProperty('--secondary-color', currentBrand.get('secondaryColor'));
            elementStyle.setProperty('--navbar-logo-img-url', currentBrand.get('navbarLogoImage'));
            elementStyle.setProperty('--hero-logo-img-url', currentBrand.get('heroLogoImage'));
            elementStyle.setProperty('--hero-background-img-url', currentBrand.get('heroBackgroundImage'));
        }
    }
}

export default Modifier.modifier(WithBrandingModifier);
