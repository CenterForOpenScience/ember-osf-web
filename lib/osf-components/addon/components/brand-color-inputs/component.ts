import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class BrandColorInputs extends Component {
    primaryColor: string | null = null;

    @action
    setPrimaryColor() {
        const brandContainers = Array.from(document.getElementsByClassName('brand-container'));
        // @ts-ignore - style is present on CSSStyleDeclaration
        brandContainers.map(container => container.style).forEach(style => {
            style.setProperty('--primary-color', this.primaryColor);
        });
    }
}
