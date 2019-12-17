import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel from 'ember-osf-web/models/registration';

import template from './template';

export interface FinalizeRegistrationModalManager {
    registration: RegistrationModel;
    hasEmbargoEndDate: boolean;
    submitRegistration: () => void;
    setEmbargoEndDate: (embargoEndDate: Date | null) => void;
    setCreateDoi: (createDoi: boolean) => void;
    submittingRegistration: boolean;
}

@layout(template)
@tagName('')
export default class FinalizeRegistrationModalManagerComponent extends Component.extend({
    submitRegistration: task(function *(this: FinalizeRegistrationModalManagerComponent) {
        try {
            yield this.registration.save();

            if (this.onSubmitRegistration) {
                this.onSubmitRegistration(this.registration.id);
            }
        } catch (error) {
            this.toast.error(this.i18n.t('registries.drafts.draft.submit_error'));
            throw error;
        }
    }),
})
    implements FinalizeRegistrationModalManager {
    @service i18n!: I18N;
    @service toast!: Toast;

    // Required attrs
    registration!: RegistrationModel;

    // Optional parameters
    onSubmitRegistration?: (registrationId: string) => void;

    @alias('submitRegistration.isRunning') submittingRegistration!: boolean;

    didReceiveAttrs() {
        assert('finalize-registration-modal::manager must have a registration', Boolean(this.registration));
    }

    @computed('registration.embargoEndDate')
    get hasEmbargoEndDate() {
        return this.registration.embargoEndDate instanceof Date;
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
