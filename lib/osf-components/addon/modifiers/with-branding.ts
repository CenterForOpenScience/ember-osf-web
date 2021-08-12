import Modifier from 'ember-modifier';
import BrandModel from 'ember-osf-web/models/brand';

interface WithBrandingModifierArgs {
    positional: [BrandModel | null];
    named: {};
}

export default class WithBrandingModifier extends Modifier<WithBrandingModifierArgs> {
    didReceiveArguments() {
        const { element } = this;
        const elementStyle = (element as HTMLElement).style;
        const brand = this.args.positional[0];

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
