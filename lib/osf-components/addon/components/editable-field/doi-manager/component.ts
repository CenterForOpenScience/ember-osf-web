import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import Store from 'ember-data/store';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

export interface DoiManager {
    requestDoi: () => void;
    nodeDoi: string;
    nodeDoiUrl: string;
}

const {
    OSF: {
        doiUrlPrefix,
    },
} = config;

@tagName('')
@layout(template)
export default class DoiManagerComponent extends Component {
    // required
    node!: Registration;
    nodeDoi!: string;

    // private
    @service intl!: Intl;
    @service toast!: Toast;
    @service store!: Store;

    requestedEditMode: boolean = false;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @not('nodeDoi') fieldIsEmpty!: boolean;

    @computed('userCanEdit', 'node.reviewsState', 'nodeDoi')
    get userCanMintDoi() {
        return !this.nodeDoi && this.userCanEdit && this.node.reviewsState === RegistrationReviewStates.Accepted;
    }

    @computed('fieldIsEmpty', 'userCanMintDoi')
    get shouldShowField() {
        return this.userCanMintDoi || !this.fieldIsEmpty;
    }

    @computed('nodeDoi')
    get nodeDoiUrl() {
        return `${doiUrlPrefix}${this.nodeDoi}`;
    }

    @task({ on: 'didReceiveAttrs' })
    async loadIdentifiers() {
        if (this.node) {
            const identifiers = await this.node.identifiers;
            const doi = identifiers.find(i => i.category === 'doi');
            if (doi) {
                this.set('nodeDoi', doi.value);
            }
        }
    }

    @task
    async requestDoi() {
        if (this.node) {
            const identifier = this.store.createRecord('identifier', {
                category: 'doi',
                referent: this.node,
            });

            try {
                const doi = await identifier.save();
                if (doi) {
                    this.set('nodeDoi', doi.value);
                }
            } catch (e) {
                identifier.rollbackAttributes();
                const errorMessage = this.intl.t('registries.registration_metadata.mint_doi.error');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
            this.set('requestedEditMode', false);
            this.toast.success(this.intl.t('registries.registration_metadata.mint_doi.success'));
        }
    }

    @action
    startEditing() {
        this.set('requestedEditMode', true);
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }
}
