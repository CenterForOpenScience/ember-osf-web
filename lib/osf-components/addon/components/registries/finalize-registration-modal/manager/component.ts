import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import RegistrationModel from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

export interface FinalizeRegistrationModalManager {
    draftRegistration: DraftRegistrationModel;
    registration: RegistrationModel;
    isOpen: boolean;
    renderInPlace: boolean;
    submitRegistration: () => void;
    setEmbargoEndDate: (embargoEndDate: Date | null) => void;
    setCreateDoi: (createDoi: boolean) => void;
}

@layout(template)
@tagName('')
export default class FinalizeRegistrationModalManagerComponent extends Component {
    // Required attrs
    draftRegistration!: DraftRegistrationModel;
    registration!: RegistrationModel;
    isOpen: boolean = defaultTo(this.isOpen, false);
    renderInPlance: boolean = defaultTo(this.renderInPlance, false);

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
