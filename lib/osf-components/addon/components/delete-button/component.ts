import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import randomScientist from 'ember-osf-web/utils/random-scientist';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('span')
export default class DeleteButton extends Component.extend({
    _deleteTask: task(function *(this: DeleteButton) {
        try {
            yield this.delete();
            this.set('modalShown', false);
        } catch (e) {
            this.toast.error(this.errorMessage);
            throw e;
        }
    }).drop(),
}) {
    @service analytics!: Analytics;
    @service i18n!: I18n;
    @service toast!: Toast;

    // Required arguments
    @requiredAction delete!: () => unknown;

    // Optional arguments
    small: boolean = defaultTo(this.small, false);
    hardConfirm: boolean = defaultTo(this.hardConfirm, false);
    disabled: boolean = defaultTo(this.disabled, false);
    buttonLabel: string = defaultTo(
        this.buttonLabel,
        this.i18n.t('osf-components.delete-button.buttonLabel'),
    );
    modalTitle: string = defaultTo(
        this.modalTitle,
        this.i18n.t('osf-components.delete-button.modalTitle'),
    );
    modalBody: string = defaultTo(
        this.modalBody,
        this.i18n.t('osf-components.delete-button.modalBody'),
    );
    confirmButtonText: string = defaultTo(
        this.confirmButtonText,
        this.i18n.t('osf-components.delete-button.confirmButtonText'),
    );
    cancelButtonText: string = defaultTo(
        this.cancelButtonText,
        this.i18n.t('osf-components.delete-button.cancelButtonText'),
    );
    errorMessage: string = defaultTo(
        this.errorMessage,
        this.i18n.t('osf-components.delete-button.error'),
    );

    // Private properties
    modalShown: boolean = false;
    scientistName: string = '';
    scientistInput: string = '';

    @computed('_deleteTask.isRunning', 'hardConfirm', 'scientistName', 'scientistInput')
    get confirmDisabled() {
        return this._deleteTask.isRunning || (
            this.hardConfirm && (this.scientistName !== this.scientistInput)
        );
    }

    @action
    _show(this: DeleteButton) {
        this.set('modalShown', true);
        if (this.hardConfirm) {
            this.setProperties({
                scientistName: randomScientist(),
                scientistInput: '',
            });
        }
    }

    @action
    _cancel(this: DeleteButton) {
        this.set('modalShown', false);
    }
}
