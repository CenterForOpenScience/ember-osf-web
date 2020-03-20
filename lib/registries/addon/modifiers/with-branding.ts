import Modifier from 'ember-oo-modifiers';

import Brand from 'registries/services/brand';

class WithBrandingModifier extends Modifier {
    didInsertElement([brand]: [Brand]) {
        const elementStyle = this.element.style;
        const { currentBrand } = brand;

        if (currentBrand) {
            elementStyle.setProperty('--primary-color', currentBrand.primaryColor);
            elementStyle.setProperty('--secondary-color', currentBrand.secondaryColor);
            elementStyle.setProperty('--navbar-logo-img-url', currentBrand.navbarLogoImage);
            elementStyle.setProperty('--hero-logo-img-url', currentBrand.heroLogoImage);
            elementStyle.setProperty('--hero-background-img-url', currentBrand.heroBackgroundImage);
        }
    }
}

export default Modifier.modifier(WithBrandingModifier);
