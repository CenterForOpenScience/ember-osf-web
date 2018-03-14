import LinkComponent from '@ember/routing/link-component';

export default class LinkTo extends LinkComponent {
    onClick: () => void;

    constructor(this: LinkTo) {
        super(...arguments);
        const bindings = this.get('attributeBindings');
        this.set('attributeBindings', [...bindings, 'ariaLabel:aria-label']);

        if (this.onClick) {
            this.on('click', this, this.onClick);
        }
    }
}
