import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
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
export default class FinalizeRegistrationModalManagerComponent extends Component
    implements FinalizeRegistrationModalManager {
    // Required attrs
    registration!: RegistrationModel;

    // Optional parameters
    isOpen: boolean = defaultTo(this.isOpen, false);
    renderInPlance: boolean = defaultTo(this.renderInPlance, false);

    didReceiveAttrs() {
        assert('finalize-registration-model::manager must have a registration', Boolean(this.registration));
    }

    @computed('registration.embargoEndDate')
    get hasEmbargoEndDate() {
        return this.registration.embargoEndDate instanceof Date;
    }

    @action
    submitRegistration() {
        return this.registration.save();
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
