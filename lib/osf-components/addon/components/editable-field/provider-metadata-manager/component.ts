import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
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
                this.registration.set(
                    'providerSpecificMetadata',
                    JSON.parse(JSON.stringify(this.currentProviderMetadata)),
                );
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

    requestedEditMode: boolean = false;
    currentProviderMetadata: ProviderMetadata[] = [];

    @tracked currentModerator?: ModeratorModel;

    @alias('registration.provider.currentUserCanReview') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @alias('registration.providerSpecificMetadata') providerSpecificMetadata!: ProviderMetadata[];

    @computed('registration.providerSpecificMetadata')
    get fieldIsEmpty() {
        return this.registration.providerSpecificMetadata.reduce(this.compareFieldValues, true);
    }

    compareFieldValues(isEmpty: boolean, item: ProviderMetadata) {
        return isEmpty && !item.field_value;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @action
    startEditing() {
        this.setProperties({
            currentProviderMetadata: JSON.parse(JSON.stringify(this.registration.providerSpecificMetadata)),
            requestedEditMode: true,
        });
    }

    @action
    cancel() {
        this.setProperties({
            currentProviderMetadata: JSON.parse(JSON.stringify(this.registration.providerSpecificMetadata)),
            requestedEditMode: false,
        });
    }

    didReceiveAttrs() {
        this.set(
            'currentProviderMetadata',
            JSON.parse(JSON.stringify(this.registration.providerSpecificMetadata)),
        );
    }
}
