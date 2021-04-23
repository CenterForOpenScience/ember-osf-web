import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { dropTask } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import randomScientist from 'ember-osf-web/utils/random-scientist';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('span')
export default class DeleteButton extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service toast!: Toast;

    // Required arguments
    @requiredAction delete!: () => unknown;

    // Optional arguments
    small = false;
    smallSecondary = false;
    noBackground = false;
    hardConfirm = false;
    disabled = false;
    shouldStopPropagation = false;
    icon = 'times';
    buttonLabel = this.intl.t('osf-components.delete-button.buttonLabel');
    modalTitle = this.intl.t('osf-components.delete-button.modalTitle');
    modalBody = this.intl.t('osf-components.delete-button.modalBody');
    confirmButtonText = this.intl.t('osf-components.delete-button.confirmButtonText');
    cancelButtonText = this.intl.t('osf-components.delete-button.cancelButtonText');
    errorMessage = this.intl.t('osf-components.delete-button.error');

    // Private properties
    modalShown = false;
    scientistName = '';
    scientistInput = '';

    @computed('_deleteTask.isRunning', 'hardConfirm', 'scientistName', 'scientistInput')
    get confirmDisabled() {
        return taskFor(this._deleteTask).isRunning || (
            this.hardConfirm && (this.scientistName !== this.scientistInput)
        );
    }

    @dropTask
    @waitFor
    async _deleteTask() {
        try {
            await this.delete();
            this.set('modalShown', false);
        } catch (e) {
            captureException(e, { errorMessage: this.errorMessage });
            this.toast.error(getApiErrorMessage(e), this.errorMessage);
        }
    }

    @action
    _show(event: Event) {
        this.set('modalShown', true);
        if (this.shouldStopPropagation) {
            event.stopPropagation();
        }
        if (this.hardConfirm) {
            this.setProperties({
                scientistName: randomScientist(),
                scientistInput: '',
            });
        }
    }

    @action
    _cancel() {
        this.set('modalShown', false);
    }
}
