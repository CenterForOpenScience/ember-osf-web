import LinkComponent from '@ember/routing/link-component';

/**
 * Custom extensions to ember's link-to component
 *
 * @class link-to
 */
export default class LinkTo extends LinkComponent {
    /**
     * Action called when the link is clicked
     *
     * @property clickAction
     * @type Action
     */
    clickAction: () => void;

    /**
     * Value for the link's aria-label attribute
     *
     * @property ariaLabel
     * @type String
     */
    ariaLabel: string;

    constructor(this: LinkTo) {
        super(...arguments);
        const bindings = this.get('attributeBindings');
        this.set('attributeBindings', [...bindings, 'ariaLabel:aria-label']);

        if (this.clickAction) {
            this.on(this.get('eventName'), this, this.clickAction);
        }
    }
}
