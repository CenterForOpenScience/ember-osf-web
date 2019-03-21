import { action } from '@ember-decorators/object';
import { alias, sort } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesLicensePicker extends Component.extend({
    queryLicenses: task(function *(this: RegistriesLicensePicker, name?: string) {
        if (!(this.providerLicenses && this.providerLicenses.length)) {
            return;
        }

        if (name) {
            yield timeout(500);
        }

        const licensesAcceptable = this.providerLicenses
            .filter(license => license.get('name').includes(name || ''));

        this.setProperties({ licensesAcceptable });
        this.registration.notifyPropertyChange('license');

        return licensesAcceptable;
    }).on('didReceiveAttrs').restartable(),
    getAllProviderLicenses: task(function *(this: RegistriesLicensePicker) {
        const provider = yield this.registration.provider;
        if (!provider) {
            return;
        }
        const providerLicenses: QueryHasManyResult<License> = yield provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
            });

        this.setProperties({ providerLicenses });
    }).on('init'),
}) {
    // Required
    editMode: boolean = defaultTo(this.editMode, false);
    registration!: Registration;

    // Private
    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service toast!: Toast;

    showText: boolean = false;
    providerLicenses!: QueryHasManyResult<License>;
    licensesAcceptable!: QueryHasManyResult<License>;
    helpLink: string = 'http://help.osf.io/m/60347/l/611430-licensing';
    currentLicense = this.registration.license.content as License;

    @alias('registration.license') selectedLicense!: License;

    @sort('selectedLicense.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    reset(this: RegistriesLicensePicker) {
        this.registration.set('license', this.currentLicense);
    }

    @action
    changeLicense(this: RegistriesLicensePicker, selected: License) {
        this.set('selectedLicense', selected);
        this.registration.setNodeLicenseDefaults(selected.requiredFields);
    }

    @action
    notify(this: RegistriesLicensePicker) {
        this.registration.notifyPropertyChange('nodeLicense');
    }

    @action
    onHideModal() {
        const licenseChanged = this.currentLicense !== this.registration.license;
        if (licenseChanged || this.registration.hasDirtyAttributes) {
            this.reset();
        }
        this.set('editMode', false);
    }

    @action
    onSave() {
        this.toast.success(this.i18n.t('registries.registration_metadata.edit_license.success'));
        this.set('currentLicense', this.selectedLicense);
        this.set('editMode', false);
    }

    @action
    onError() {
        this.toast.error(this.i18n.t('registries.registration_metadata.edit_license.error'));
        this.set('editMode', false);
    }

    @action
    onCancel() {
        this.reset();
    }
}
