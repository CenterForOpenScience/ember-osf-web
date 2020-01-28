import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import { ChangesetDef } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import License from 'ember-osf-web/models/license';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

import template from './template';

@tagName('')
@layout(template)
export default class LicensePickerManager extends Component {
    @service store!: DS.Store;

    // required
    draftManager!: DraftRegistrationManager;

    // private
    licensesAcceptable!: QueryHasManyResult<License>;

    @alias('draftManager.draftRegistration.license') selectedLicense!: License;

    @alias('draftManager.metadataChangeset') registration!: ChangesetDef;
    @alias('draftManager.draftRegistration') draftRegistration!: DraftRegistration;

    @sort('selectedLicense.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @task({ restartable: true, on: 'didReceiveAttrs' })
    queryLicenses = task(function *(this: LicensePickerManager, name?: string) {
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
    getAllProviderLicenses = task(function *(this: LicensePickerManager) {
        const provider = yield this.draftManager.draftRegistration.provider;

        if (!provider) {
            return;
        }

        const providerLicenses: QueryHasManyResult<License> = yield provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
            });

        this.setProperties({
            licensesAcceptable: providerLicenses,
        });
    });

    @action
    changeLicense(selected: License) {
        this.set('selectedLicense', selected);
        this.draftRegistration.setNodeLicenseDefaults(selected.requiredFields);
        /*
        this.registration.set('license', selected);
        this.registration.set('nodeLicense', this.draftRegistration.nodeLicense);
        */
    }

    @action
    noop() {
        //
        // Empty action because the RegistriesLicensePicker expects
        // an action for submit(), cancel(), and error()
        //
    }

    @action
    onInput() {
        this.draftManager.onMetadataInput.perform();
    }
}
