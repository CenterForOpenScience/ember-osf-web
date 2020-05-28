import DS from 'ember-data';
import Modifier from 'ember-oo-modifiers';
import BrandModel from 'ember-osf-web/models/brand';

class WithBrandingModifier extends Modifier {
    didReceiveArguments([brand]: [BrandModel | DS.PromiseObject<BrandModel> | null]) {
        const brandModel = (brand && 'content' in brand) ? brand.content : brand;
        const { element } = this;
        const elementStyle = element.style;

        if (brandModel) {
            element.classList.add('brand-container');
            elementStyle.setProperty('--primary-color', brandModel.primaryColor);
            elementStyle.setProperty('--secondary-color', brandModel.secondaryColor);
            elementStyle.setProperty('--navbar-logo-img-url', `url(${brandModel.topnavLogoImage})`);
            elementStyle.setProperty('--hero-logo-img-url', `url(${brandModel.heroLogoImage})`);
            elementStyle.setProperty('--hero-background-img-url', `url(${brandModel.heroBackgroundImage})`);
        } else {
            element.classList.remove('brand-container');
            elementStyle.removeProperty('--primary-color');
            elementStyle.removeProperty('--secondary-color');
            elementStyle.removeProperty('--navbar-logo-img-url');
            elementStyle.removeProperty('--hero-logo-img-url');
            elementStyle.removeProperty('--hero-background-img-url');
        }
    }
}

export default Modifier.modifier(WithBrandingModifier);
