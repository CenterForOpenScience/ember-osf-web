import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed, set } from '@ember/object';
import { alias, and, not, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import captureException from 'ember-osf-web/utils/capture-exception';

import { layout } from 'ember-osf-web/decorators/component';
import LicenseModel from 'ember-osf-web/models/license';
import NodeModel, { NodeLicense } from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import { LicenseManager } from 'registries/components/registries-license-picker/component';

import { Changeset } from 'ember-changeset';
import lookupValidator, { ValidationObject } from 'ember-changeset-validations';
import { BufferedChangeset } from 'ember-changeset/types';
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
    @service store!: Store;
    @service toast!: Toast;

    changeset!: BufferedChangeset;
    requestedEditMode = false;

    showText = false;
    licensesAcceptable!: QueryHasManyResult<LicenseModel>;
    helpLink = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
    currentLicense!: LicenseModel;
    currentNodeLicense!: NodeLicense;
    selectedLicense!: NodeModel['license'];

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @not('currentLicense') fieldIsEmpty!: boolean;

    @sort('selectedLicense.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
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
            this.changeset = Changeset(
                this.node,
                lookupValidator(validatorObject),
                validatorObject,
            ) as BufferedChangeset;
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
        this.changeset.set('license', this.currentLicense);
        this.changeset.set('nodeLicense', { ...this.currentNodeLicense });
    }

    @action
    changeLicense(selected: LicenseModel) {
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
            this.toast.success(this.intl.t('registries.registration_metadata.edit_license.success'));
        } catch (e) {
            const errorMessage = this.intl.t('registries.registration_metadata.edit_license.error');
            this.toast.error(errorMessage);
            captureException(e, { errorMessage });
        }
    }

    @action
    updateNodeLicense(key: string, event: Event) {
        const target = event.target as HTMLInputElement;
        const newNodeLicense = { ...this.changeset.get('nodeLicense') };
        newNodeLicense[key] = target.value;
        this.changeset.set('nodeLicense', newNodeLicense);
    }
}
