import Component from '@glimmer/component';
import { tracked } from 'tracked-built-ins';
import { action } from '@ember/object';
import { not } from '@ember/object/computed';

interface Args {
    type: string;
    onDismissed: () => void;
    onDismiss: () => boolean;
    dismissible: boolean;
    visible: boolean;
}
export default class Alert extends Component<Args> {
    // Note: Most of this was ripped from:
    // https://github.com/ember-bootstrap/ember-bootstrap/blob/v4.6.3/addon/components/bs-alert.js
    // and then simplified to remove fade transitions

    // Args
    onDismissed?: () => void;
    onDismiss?: () => boolean;
    type?: string;
    dismissible = true;
    @tracked visible = true;
    @not('visible') hidden!: boolean;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.type = args.type;
        if (args.visible === false) {
            this.visible = args.visible;
        }
        this.dismissible = args.dismissible;
    }

    get showAlert() {
        return this.visible;
    }

    @action
    dismiss() {
        if (this.args.onDismiss?.() !== false) {
            this.visible = false;
        }
    }

    show() {
        this.visible = true;
    }

    hide() {
        if (this.hidden) {
            return;
        }
        this.visible = false;
        this.args.onDismissed?.();
    }

    @action
    showOrHide() {
        if (this.visible) {
            this.show();
        } else {
            this.hide();
        }
    }
}
