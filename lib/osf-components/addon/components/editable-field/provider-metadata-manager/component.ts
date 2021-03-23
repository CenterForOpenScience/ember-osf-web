import { action } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import Registration, { ProviderMetadata } from 'ember-osf-web/models/registration';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export interface Args {
    registration: Registration;
}

export interface ProviderMetadataManager {
    save: () => void;
    cancel: () => void;
    inEditMode: boolean;
    currentProviderMetadata: ProviderMetadata[];
    userCanEdit: boolean;
}

export default class ProviderMetadataManagerComponent extends Component<Args> {
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service store!: DS.Store;
    @service toast!: Toast;

    @task({ withTestWaiter: true })
    save = task(function *(this: ProviderMetadataManagerComponent) {
        if (this.args.registration) {
            try {
                this.providerSpecificMetadata = this.deepCopy(this.currentProviderMetadata);
                yield this.args.registration.save();
            } catch (e) {
                const errorMessage = this.intl.t('registries.registration_metadata.edit_provider_metadata.error');
                captureException(e, { errorMessage });
                this.args.registration.rollbackAttributes();
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
            this.requestedEditMode = false;
            this.toast.success(this.intl.t('registries.registration_metadata.edit_provider_metadata.success'));
        }
    });

    @tracked currentProviderMetadata: ProviderMetadata[] = [];
    @tracked requestedEditMode: boolean = false;

    @alias('args.registration.provider.currentUserCanReview') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @alias('args.registration.providerSpecificMetadata') providerSpecificMetadata!: ProviderMetadata[];

    get fieldIsEmpty() {
        if (this.args.registration && this.args.registration.providerSpecificMetadata) {
            return this.args.registration.providerSpecificMetadata.reduce(this.compareFieldValues, true);
        }
        return true;
    }

    compareFieldValues(isEmpty: boolean, item: ProviderMetadata) {
        return isEmpty && !item.field_value;
    }

    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @action
    startEditing() {
        this.currentProviderMetadata = this.deepCopy(this.args.registration.providerSpecificMetadata);
        this.requestedEditMode = true;
    }

    @action
    cancel() {
        this.currentProviderMetadata = this.deepCopy(this.args.registration.providerSpecificMetadata);
        this.requestedEditMode = false;
    }

    @action
    setCurrentProviderMetadata() {
        this.currentProviderMetadata = this.deepCopy(this.args.registration.providerSpecificMetadata);
    }

    deepCopy(providerMetadata: ProviderMetadata[]) {
        return JSON.parse(JSON.stringify(providerMetadata));
    }
}
