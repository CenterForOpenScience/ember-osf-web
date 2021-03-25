import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import template from './template';

export interface FinalizeRegistrationModalManager {
    registration: RegistrationModel;
    hasEmbargoEndDate: boolean;
    submitRegistration: () => Promise<void>;
    setEmbargoEndDate: (embargoEndDate: Date | null) => void;
    setCreateDoi: (createDoi: boolean) => void;
    submittingRegistration: boolean;
    draftManager: DraftRegistrationManager;
}

@layout(template)
@tagName('')
export default class FinalizeRegistrationModalManagerComponent extends Component
    implements FinalizeRegistrationModalManager {
    @service intl!: Intl;
    @service toast!: Toast;

    // Required arguments
    registration!: RegistrationModel;
    draftManager!: DraftRegistrationManager;

    // Optional arguments
    onSubmitRegistration?: (registrationId: string) => void;

    // Private
    @alias('submitRegistration.isRunning') submittingRegistration!: boolean;

    @task({ withTestWaiter: true })
    submitRegistration = task(function *(this: FinalizeRegistrationModalManagerComponent) {
        try {
            this.draftManager.validateAllVisitedPages();
            yield this.registration.save();

            if (this.onSubmitRegistration) {
                this.onSubmitRegistration(this.registration.id);
            }
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.submit_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    });

    @computed('registration.embargoEndDate')
    get hasEmbargoEndDate() {
        return this.registration.embargoEndDate instanceof Date;
    }

    didReceiveAttrs() {
        assert('finalize-registration-modal::manager must have a registration', Boolean(this.registration));
    }

    @action
    setEmbargoEndDate(embargoEndDate: Date | null) {
        this.registration.set('embargoEndDate', embargoEndDate);
    }

    @action
    setCreateDoi(createDoi: boolean) {
        this.registration.set('createDoi', createDoi);
    }
}
