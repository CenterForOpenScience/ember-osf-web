import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

export interface FinalizeRegistrationModalManager {
    registration: RegistrationModel;
    isOpen: boolean;
    renderInPlace: boolean;
    hasEmbargoEndDate: boolean;
    submitRegistration: () => void;
    setEmbargoEndDate: (embargoEndDate: Date | null) => void;
    setCreateDoi: (createDoi: boolean) => void;
}

@layout(template)
@tagName('')
export default class FinalizeRegistrationModalManagerComponent extends Component.extend({
    submitRegistration: task(function *(this: FinalizeRegistrationModalManagerComponent) {
        try {
            yield this.registration.save();

            this.toggleProperty('isOpen');
        } catch (error) {
            this.toast.error(this.i18n.t('registries.drafts.draft.submit_error'));
            throw error;
        }

        if (this.onSubmitRegistration) {
            this.onSubmitRegistration(this.registration.id);
        }
    }),
})
    implements FinalizeRegistrationModalManager {
    @service i18n!: I18N;
    @service toast!: Toast;

    // Required attrs
    registration!: RegistrationModel;

    // Optional parameters
    isOpen: boolean = defaultTo(this.isOpen, false);
    renderInPlace: boolean = defaultTo(this.renderInPlace, false);
    onSubmitRegistration?: (registrationId: string) => void;

    didReceiveAttrs() {
        assert('finalize-registration-model::manager must have a registration', Boolean(this.registration));
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
