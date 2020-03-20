import Modifier from 'ember-oo-modifiers';

import Brand from 'registries/services/brand';

class WithBrandingModifier extends Modifier {
    didInsertElement([brand]: [Brand]) {
        const element = this.element;
        const elementStyle = element.style;
        const { currentBrand } = brand;

        if (currentBrand) {
            element.classList.add('brand-container');
            elementStyle.setProperty('--primary-color', currentBrand.primaryColor);
            elementStyle.setProperty('--secondary-color', currentBrand.secondaryColor);
            elementStyle.setProperty('--navbar-logo-img-url', currentBrand.navbarLogoImage);
            elementStyle.setProperty('--hero-logo-img-url', currentBrand.heroLogoImage);
            elementStyle.setProperty('--hero-background-img-url', currentBrand.heroBackgroundImage);
        }
    }
}

export default Modifier.modifier(WithBrandingModifier);
