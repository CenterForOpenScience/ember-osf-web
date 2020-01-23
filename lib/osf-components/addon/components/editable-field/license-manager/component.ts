import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and, not, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import { NodeLicense } from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';

import template from './template';

export interface LicenseManager {
    queryLicenses: () => void;
    onSave: () => void;
    onError: () => void;
    onCancel: () => void;
    changeLicense: () => void;
    registration: Registration;
    requiredFields: string[];
    selectedLicense: License;
    licensesAcceptable: License[];
}

@tagName('')
@layout(template)
export default class LicenseManagerComponent extends Component {
    // required
    node!: Registration;

    // private
    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service toast!: Toast;

    requestedEditMode: boolean = false;

    showText: boolean = false;
    licensesAcceptable!: QueryHasManyResult<License>;
    helpLink: string = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
    currentLicense!: License;
    currentNodeLicense!: NodeLicense;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @alias('node.license') selectedLicense!: License;
    @not('currentLicense') fieldIsEmpty!: License;

    @sort('selectedLicense.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @task({ restartable: true, on: 'didReceiveAttrs' })
    queryLicenses = task(function *(this: LicenseManagerComponent, name?: string) {
        if (this.licensesAcceptable && this.licensesAcceptable.length) {
            if (name) {
                yield timeout(500);
            }

            const licensesAcceptable = this.licensesAcceptable
                .filter(license => license.get('name').includes(name || ''));

            this.setProperties({ licensesAcceptable });
            return licensesAcceptable;
        }
        return undefined;
    });

    @task({ on: 'init' })
    getAllProviderLicenses = task(function *(this: LicenseManagerComponent) {
        const provider = yield this.node.provider;

        if (!provider) {
            return;
        }

        const providerLicenses: QueryHasManyResult<License> = yield provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
            });

        this.setProperties({
            licensesAcceptable: providerLicenses,
            currentLicense: yield this.node.license,
            currentNodeLicense: { ...this.node.nodeLicense },
        });
    });

    @action
    startEditing() {
        this.set('requestedEditMode', true);
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }

    reset() {
        this.node.setProperties({
            license: this.currentLicense,
            nodeLicense: { ...this.currentNodeLicense },
        });
    }

    @action
    changeLicense(selected: License) {
        this.set('selectedLicense', selected);
        this.node.setNodeLicenseDefaults(selected.requiredFields);
    }

    @action
    onSave() {
        this.toast.success(this.i18n.t('registries.registration_metadata.edit_license.success'));
        this.setProperties({
            currentLicense: this.selectedLicense,
            currentNodeLicense: { ...this.node.nodeLicense },
        });
        this.set('requestedEditMode', false);
    }

    @action
    onError() {
        this.toast.error(this.i18n.t('registries.registration_metadata.edit_license.error'));
    }

    @action
    onCancel() {
        this.reset();
        this.set('requestedEditMode', false);
    }
}
