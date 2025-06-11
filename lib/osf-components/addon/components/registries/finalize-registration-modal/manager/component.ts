import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat, validateLength } from 'ember-changeset-validations/validators';
import { DOIRegex } from 'ember-osf-web/utils/doi';
import template from './template';

export interface FinalizeRegistrationModalManager {
    registration: RegistrationModel;
    hasEmbargoEndDate: boolean;
    submitRegistration: () => Promise<void>;
    setEmbargoEndDate: (embargoEndDate: Date | null) => void;
    submittingRegistration: boolean;
    draftManager: DraftRegistrationManager;
}

interface ManualDoiAndGuidForm {
    manualDoi: string;
    manualGuid: string;
}

@layout(template)
@tagName('')
export default class FinalizeRegistrationModalManagerComponent extends Component
    implements FinalizeRegistrationModalManager {
    @service intl!: Intl;
    @service toast!: Toast;

    // validationFunction() {
    //     debugger;
    // }
    manualDoiAndGuidFormChangesetValidation: ValidationObject<ManualDoiAndGuidForm> = {
        manualDoi: validateFormat({
            allowBlank: true,
            allowNone: true,
            ignoreBlank: true,
            regex: DOIRegex,
            type: 'invalid_doi',
        }),
        // manualDoi: this.validationFunction,
        manualGuid: validateLength({
            allowBlank: true,
            min:5,
            type: 'greaterThanOrEqualTo',
            translationArgs: {
                description: this.intl.t('preprints.submit.step-title.guid'),
                gte: '5 characters',
            },
        }),
    };
    // Required arguments
    registration!: RegistrationModel;
    draftManager!: DraftRegistrationManager;
    guidAndDoiFormChangeset!: any;

    // Optional arguments
    onSubmitRegistration?: (registrationId: string) => void;

    // Private
    @alias('submitRegistration.isRunning') submittingRegistration!: boolean;

    @task
    @waitFor
    async submitRegistration() {
        try {
            this.draftManager.validateAllVisitedPages();
            await this.registration.save();

            if (this.onSubmitRegistration) {
                this.onSubmitRegistration(this.registration.id);
            }
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.submit_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }

    @computed('registration.embargoEndDate')
    get hasEmbargoEndDate() {
        return this.registration.embargoEndDate instanceof Date;
    }

    didReceiveAttrs() {
        assert('finalize-registration-modal::manager must have a registration', Boolean(this.registration));
        this.guidAndDoiFormChangeset = buildChangeset(this.registration, this.manualDoiAndGuidFormChangesetValidation);
    }

    @action
    validateManualDoiAndGuid() {
        // debugger;
        this.guidAndDoiFormChangeset.validate();
        this.guidAndDoiFormChangeset.execute();
    }

    @action
    setEmbargoEndDate(embargoEndDate: Date | null) {
        this.registration.set('embargoEndDate', embargoEndDate);
    }
}
