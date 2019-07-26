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
    closeOnOutsideClick: boolean = defaultTo(this.closeOnOutsideClick, true);
    renderInPlace: boolean = defaultTo(this.renderInPlace, false);
    isModal: boolean = defaultTo(this.isModal, true);

    isDialogVisible: boolean = defaultTo(this.isDialogVisible, false);

    @action
    openDialog() {
        this.set('isDialogVisible', true);
        if (this.isModal) {
            this.osfModalState.enterModalState();
        }
    }

    @action
    closeDialog() {
        this.set('isDialogVisible', false);
        if (this.isModal) {
            this.osfModalState.exitModalState();
        }
    }

    @action
    onClickBackground(event: MouseEvent) {
        const isOutsideDialog = event.target === event.currentTarget;
        if (isOutsideDialog && this.closeOnOutsideClick) {
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
