import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
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
    small: boolean = false;
    smallSecondary: boolean = false;
    noBackground: boolean = false;
    hardConfirm: boolean = false;
    disabled: boolean = false;
    shouldStopPropagation = false;
    icon: string = 'times';
    buttonLabel: string = this.intl.t('osf-components.delete-button.buttonLabel');
    modalTitle: string = this.intl.t('osf-components.delete-button.modalTitle');
    modalBody: string = this.intl.t('osf-components.delete-button.modalBody');
    confirmButtonText: string = this.intl.t('osf-components.delete-button.confirmButtonText');
    cancelButtonText: string = this.intl.t('osf-components.delete-button.cancelButtonText');
    errorMessage: string = this.intl.t('osf-components.delete-button.error');

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

    @task({ withTestWaiter: true, drop: true })
    _deleteTask = task(function *(this: DeleteButton) { // tslint:disable-line variable-name
        try {
            yield this.delete();
            this.set('modalShown', false);
        } catch (e) {
            captureException(e, { errorMessage: this.errorMessage });
            this.toast.error(getApiErrorMessage(e), this.errorMessage);
        }
    });

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
