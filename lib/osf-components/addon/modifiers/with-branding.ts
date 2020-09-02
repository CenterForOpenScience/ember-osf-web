import Modifier from 'ember-oo-modifiers';
import BrandModel from 'ember-osf-web/models/brand';

class WithBrandingModifier extends Modifier {
    didReceiveArguments([brand]: [BrandModel | null]) {
        const { element } = this;
        const elementStyle = element.style;

        if (brand) {
            element.classList.add('with-custom-branding');
            elementStyle.setProperty('--primary-color', brand.primaryColor);
            elementStyle.setProperty('--secondary-color', brand.secondaryColor);
            elementStyle.setProperty('--navbar-logo-img-url', `url(${brand.topnavLogoImage})`);
            elementStyle.setProperty('--hero-logo-img-url', `url(${brand.heroLogoImage})`);
            elementStyle.setProperty('--hero-background-img-url', `url(${brand.heroBackgroundImage})`);
        } else {
            element.classList.remove('with-custom-branding');
            elementStyle.removeProperty('--primary-color');
            elementStyle.removeProperty('--secondary-color');
            elementStyle.removeProperty('--navbar-logo-img-url');
            elementStyle.removeProperty('--hero-logo-img-url');
            elementStyle.removeProperty('--hero-background-img-url');
        }
    }
}

export default Modifier.modifier(WithBrandingModifier);
