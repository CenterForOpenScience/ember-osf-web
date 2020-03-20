import Modifier from 'ember-oo-modifiers';

import Brand from 'ember-osf-web/models/brand';

class WithBrandingModifier extends Modifier {
    didInsertElement([brand]: [Brand | null]) {
        if (!brand) {
            return;
        }

        const elementStyle = this.element.style;

        elementStyle.setProperty('--primary-color', brand.primaryColor);
        elementStyle.setProperty('--secondary-color', brand.secondaryColor);
        elementStyle.setProperty('--navbar-logo-img-url', brand.navbarLogoImage);
        elementStyle.setProperty('--hero-logo-img-url', brand.heroLogoImage);
        elementStyle.setProperty('--hero-background-img-url', brand.heroBackgroundImage);
    }
}

export default Modifier.modifier(WithBrandingModifier);
