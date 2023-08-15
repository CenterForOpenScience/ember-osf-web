import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class BrandColorInputs extends Component {
    primaryColor: string | null = null;
    secondaryColor: string | null = null;

    @action
    setPrimaryColor() {
        const brandContainers = Array.from(document.getElementsByClassName('with-custom-branding'));
        // @ts-ignore - style is present on CSSStyleDeclaration
        brandContainers.map(container => container.style).forEach(style => {
            style.setProperty('--primary-color', this.primaryColor);
        });
    }

    @action
    setSecondaryColor() {
        const brandContainers = Array.from(document.getElementsByClassName('with-custom-branding'));
        // @ts-ignore - style is present on CSSStyleDeclaration
        brandContainers.map(container => container.style).forEach(style => {
            style.setProperty('--secondary-color', this.secondaryColor);
        });
    }
}
