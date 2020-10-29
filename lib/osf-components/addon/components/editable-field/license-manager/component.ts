import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed, set } from '@ember/object';
import { alias, and, not, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import { NodeLicense } from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import { LicenseManager } from 'registries/components/registries-license-picker/component';

import Changeset from 'ember-changeset';
import lookupValidator, { ValidationObject } from 'ember-changeset-validations';
import { ChangesetDef } from 'ember-changeset/types';
import { validateNodeLicense } from 'ember-osf-web/packages/registration-schema/validations';
import template from './template';

@tagName('')
@layout(template)
export default class LicenseManagerComponent extends Component implements LicenseManager {
    // required
    node!: Registration;

    // private
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service store!: DS.Store;
    @service toast!: Toast;

    changeset!: ChangesetDef;
    requestedEditMode: boolean = false;

    showText: boolean = false;
    licensesAcceptable!: QueryHasManyResult<License>;
    helpLink: string = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
    currentLicense!: License;
    currentNodeLicense!: NodeLicense;
    selectedLicense!: License;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @not('currentLicense') fieldIsEmpty!: License;

    @sort('selectedLicense.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @restartableTask({ withTestWaiter: true, on: 'didReceiveAttrs' })
    async getAllProviderLicenses() {
        const provider = await this.node.provider;

        if (!provider) {
            return;
        }

        const providerLicenses = await provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
            });

        this.setProperties({
            licensesAcceptable: providerLicenses,
            currentLicense: await this.node.license,
            currentNodeLicense: { ...this.node.nodeLicense },
        });
    }

    didReceiveAttrs() {
        if (!this.changeset) {
            const validatorObject: ValidationObject<Registration> = { nodeLicense: validateNodeLicense() };
            this.changeset = new Changeset(
                this.node,
                lookupValidator(validatorObject),
                validatorObject,
            ) as ChangesetDef;
        }
    }

    @action
    startEditing() {
        this.set('requestedEditMode', true);
    }

    @action
    cancel() {
        this.reset();
        this.set('requestedEditMode', false);
    }

    reset() {
        this.changeset.setProperties({
            license: this.currentLicense,
            nodeLicense: { ...this.currentNodeLicense },
        });
    }

    @action
    changeLicense(selected: License) {
        this.set('selectedLicense', selected);
        this.setNodeLicenseDefaults(selected.requiredFields);
    }

    setNodeLicenseDefaults(requiredFields: Array<keyof NodeLicense>): void {
        const {
            copyrightHolders = '',
            year = new Date().getUTCFullYear().toString(),
        } = (this.changeset.get('nodeLicense') || {});

        const nodeLicenseDefaults: NodeLicense = {
            copyrightHolders,
            year,
        };

        // Only set the required fields on nodeLicense
        const props = requiredFields.reduce(
            (acc, val) => ({ ...acc, [val]: nodeLicenseDefaults[val] }),
            {},
        );
        set(this.changeset, 'nodeLicense', props);
    }

    @action
    async save() {
        try {
            await this.changeset.save({});
            this.setProperties({
                currentLicense: this.selectedLicense,
                currentNodeLicense: { ...this.node.nodeLicense },
            });
            this.set('requestedEditMode', false);
        } catch (e) {
            this.toast.error(this.intl.t('registries.registration_metadata.edit_license.error'));
        }
        this.toast.success(this.intl.t('registries.registration_metadata.edit_license.success'));
    }

    @action
    updateNodeLicense(key: string, event: Event) {
        const target = event.target as HTMLInputElement;
        const newNodeLicense = { ...this.changeset.get('nodeLicense') };
        newNodeLicense[key] = target.value;
        set(this.changeset, 'nodeLicense', newNodeLicense);
    }
}
