import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import defaultTo from 'ember-osf-web/utils/default-to';
import randomScientist from 'ember-osf-web/utils/random-scientist';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistrationIsPublic extends Component {
    @service intl!: Intl;
    @service toast!: Toast;

    registration!: Registration;

    scientistName?: string;
    scientistNameInput?: string = '';
    withdrawalJustification?: string = '';
    closeDropdown!: () => void;
    showModal: boolean = defaultTo(this.showModal, false);

    @dropTask({ withTestWaiter: true })
    async submitWithdrawal() {
        if (!this.registration) {
            return;
        }

        this.registration.setProperties({
            pendingWithdrawal: true,
            withdrawalJustification: this.withdrawalJustification,
        });

        try {
            await this.registration.save();
        } catch (e) {
            const errorMessage = this.intl.t('registries.overview.withdraw.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }

        this.toast.success(this.intl.t('registries.overview.withdraw.success'));

        if (this.closeDropdown) {
            this.closeDropdown();
        }
    }

    didReceiveAttrs() {
        this.setProperties({
            scientistNameInput: '',
            scientistName: randomScientist(),
        });
    }

    @computed(
        'submitWithdrawal.isRunning',
        'scientistNameInput',
        'scientistName',
    )
    get submitDisabled(): boolean {
        return taskFor(this.submitWithdrawal).isRunning
            || (this.scientistNameInput !== this.scientistName);
    }

    @action
    close() {
        if (this.registration.hasDirtyAttributes) {
            this.registration.rollbackAttributes();
        }
        this.closeDropdown();
    }
}
