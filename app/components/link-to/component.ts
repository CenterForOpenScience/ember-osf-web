import { attribute } from '@ember-decorators/component';
import LinkComponent from '@ember/routing/link-component';

/**
 * Custom extensions to ember's link-to component
 *
 * @class link-to
 */
export default class LinkTo extends LinkComponent {
    @attribute('aria-label') ariaLabel;
    eventName: string;

    /**
     * Action called when the link is clicked
     *
     * @property clickAction
     * @type Action
     */
    clickAction: () => void = this.clickAction;

    constructor() {
        super();

        if (this.clickAction) {
            this.on(this.get('eventName'), this, this.clickAction);
        }
    }
}
