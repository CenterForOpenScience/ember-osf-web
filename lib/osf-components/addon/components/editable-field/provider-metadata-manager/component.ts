import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

export interface ProviderMetadataManager {
    save: () => void;
    cancel: () => void;
    inEditMode: boolean;
    currentProviderMetadata: ProviderMetadata[];
}

@tagName('')
@layout(template)
export default class ProviderMetadataManagerComponent extends Component {
    registration!: Registration;

    @service intl!: Intl;
    @service toast!: Toast;

    requestedEditMode: boolean = false;
    currentProviderMetadata: ProviderMetadata[] = [];

    @alias('registration.provider.currentUserIsModerator') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @computed('registration.providerSpecificMetadata')
    get fieldIsEmpty() {
        return this.registration.providerSpecificMetadata.reduce(
            (isEmpty: boolean, item: ProviderMetadata) => isEmpty && !item.field_value,
        );
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @task({ withTestWaiter: true })
    save = task(function *(this: ProviderMetadataManagerComponent) {
        if (this.registration) {
            this.registration.set('providerSpecificMetadata', this.currentProviderMetadata);
            try {
                yield this.registration.save();
            } catch (e) {
                const errorMessage = this.intl.t('registries.registration_metadata.edit_provider_metadata.error');
                captureException(e, { errorMessage });
                this.registration.rollbackAttributes();
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
            this.set('requestedEditMode', false);
            this.toast.success(this.intl.t('registries.registration_metadata.edit_provider_metadata.success'));
        }
    });

    @action
    startEditing() {
        this.setProperties({
            requestedEditMode: true,
            currentProviderMetadata: this.registration.providerSpecificMetadata,
        });
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }
}
