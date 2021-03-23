import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel from 'ember-osf-web/models/moderator';
import Registration, { ProviderMetadata } from 'ember-osf-web/models/registration';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

export interface ProviderMetadataManager {
    save: () => void;
    cancel: () => void;
    inEditMode: boolean;
    currentProviderMetadata: ProviderMetadata[];
    userCanEdit: boolean;
}

@tagName('')
@layout(template)
export default class ProviderMetadataManagerComponent extends Component {
    registration!: Registration;

    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service store!: DS.Store;
    @service toast!: Toast;

    @task({ withTestWaiter: true })
    save = task(function *(this: ProviderMetadataManagerComponent) {
        if (this.registration) {
            try {
                this.providerSpecificMetadata = this.deepCopy(this.currentProviderMetadata);
                yield this.registration.save();
            } catch (e) {
                const errorMessage = this.intl.t('registries.registration_metadata.edit_provider_metadata.error');
                captureException(e, { errorMessage });
                this.registration.rollbackAttributes();
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
            this.requestedEditMode = false;
            this.toast.success(this.intl.t('registries.registration_metadata.edit_provider_metadata.success'));
        }
    });

    @tracked currentModerator?: ModeratorModel;
    @tracked currentProviderMetadata: ProviderMetadata[] = [];
    @tracked requestedEditMode: boolean = false;

    @alias('registration.provider.currentUserCanReview') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @alias('registration.providerSpecificMetadata') providerSpecificMetadata!: ProviderMetadata[];

    get fieldIsEmpty() {
        return this.registration.providerSpecificMetadata.reduce(this.compareFieldValues, true);
    }

    compareFieldValues(isEmpty: boolean, item: ProviderMetadata) {
        return isEmpty && !item.field_value;
    }

    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @action
    startEditing() {
        this.currentProviderMetadata = this.deepCopy(this.registration.providerSpecificMetadata);
        this.requestedEditMode = true;
    }

    @action
    cancel() {
        this.currentProviderMetadata = this.deepCopy(this.registration.providerSpecificMetadata);
        this.requestedEditMode = false;
    }

    didReceiveAttrs() {
        this.currentProviderMetadata = this.deepCopy(this.registration.providerSpecificMetadata);
    }

    deepCopy(providerMetadata: ProviderMetadata[]) {
        return JSON.parse(JSON.stringify(providerMetadata));
    }
}
