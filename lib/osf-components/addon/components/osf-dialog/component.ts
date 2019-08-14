import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import OsfModalState from 'osf-components/services/osf-modal-state';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class OsfDialog extends Component {
    @service osfModalState!: OsfModalState;

    // optional
    onClose?: () => void;
    onOpen?: () => void;
    isOpen: boolean = defaultTo(this.isOpen, false);
    isModal: boolean = defaultTo(this.isModal, true);
    closeOnOutsideClick: boolean = defaultTo(this.closeOnOutsideClick, true);
    renderInPlace: boolean = defaultTo(this.renderInPlace, false);

    @action
    openDialog() {
        this.set('isOpen', true);
        if (this.onOpen) {
            this.onOpen();
        }
    }

    @action
    closeDialog() {
        this.set('isOpen', false);
        if (this.onClose) {
            this.onClose();
        }
    }

    @action
    updateModalState() {
        if (this.isModal) {
            if (this.isOpen) {
                this.osfModalState.enterModalState();
            } else {
                this.osfModalState.exitModalState();
            }
        }
    }

    @action
    onClickBackground(event: MouseEvent) {
        const isOutsideDialog = event.target === event.currentTarget;
        if (isOutsideDialog && this.closeOnOutsideClick && this.isModal) {
            this.closeDialog();
        }
    }

    @action
    onKeydown(event: KeyboardEvent) {
        // Close when `esc` is pressed
        if (event.keyCode === 27) {
            this.closeDialog();
        }
    }
}
