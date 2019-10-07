import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import Store from 'ember-data/store';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Identifier from 'ember-osf-web/models/identifier';
import Registration, { RegistrationState } from 'ember-osf-web/models/registration';

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
export default class DoiManagerComponent extends Component.extend({
    loadIdentifiers: task(function *(this: DoiManagerComponent) {
        if (this.node) {
            const identifiers: Identifier[] = yield this.node.identifiers;
            const doi = identifiers.find(i => i.category === 'doi');
            if (doi) {
                this.set('nodeDoi', doi.value);
            }
        }
    }).on('didReceiveAttrs'),
    requestDoi: task(function *(this: DoiManagerComponent) {
        if (this.node) {
            const identifier = this.store.createRecord('identifier', {
                category: 'doi',
                referent: this.node,
            });

            try {
                const doi = yield identifier.save();
                if (doi) {
                    this.set('nodeDoi', doi.value);
                }
            } catch (e) {
                identifier.rollbackAttributes();
                this.toast.error(this.i18n.t('registries.registration_metadata.mint_doi.error'));
                throw e;
            }
            this.set('requestedEditMode', false);
            this.toast.success(this.i18n.t('registries.registration_metadata.mint_doi.success'));
        }
    }),
}) {
    // required
    node!: Registration;
    nodeDoi!: string;

    // private
    @service i18n!: I18N;
    @service toast!: Toast;
    @service store!: Store;

    requestedEditMode: boolean = false;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @not('nodeDoi') fieldIsEmpty!: boolean;

    @computed('userCanEdit', 'node.state', 'nodeDoi')
    get userCanMintDoi() {
        return !this.nodeDoi && this.userCanEdit && this.node.state === RegistrationState.Public;
    }

    @computed('fieldIsEmpty', 'userCanMintDoi')
    get shouldShowField() {
        return this.userCanMintDoi || !this.fieldIsEmpty;
    }

    @computed('nodeDoi')
    get nodeDoiUrl() {
        return `${doiUrlPrefix}${this.nodeDoi}`;
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
