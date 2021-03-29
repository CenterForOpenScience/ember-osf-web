import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, set } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { BufferedChangeset } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import License from 'ember-osf-web/models/license';
import { NodeLicense } from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import { LicenseManager } from 'registries/components/registries-license-picker/component';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

import template from './template';

@tagName('')
@layout(template)
export default class LicensePickerManager extends Component implements LicenseManager {
    @service store!: DS.Store;

    // required
    draftManager!: DraftRegistrationManager;

    licensesAcceptable!: QueryHasManyResult<License>;

    @alias('draftManager.metadataChangeset.license') selectedLicense!: License;

    @alias('draftManager.metadataChangeset') registration!: BufferedChangeset;
    @alias('draftManager.draftRegistration') draftRegistration!: DraftRegistration;

    @sort('selectedLicense.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @task({ withTestWaiter: true, restartable: true, on: 'didReceiveAttrs' })
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
        if (selected.requiredFields.length) {
            const dummyNodeLicense: NodeLicense = {
                copyrightHolders: '',
                year: new Date().getUTCFullYear().toString(),
            };
            const props = selected.requiredFields.reduce(
                (acc, val) => ({ ...acc, [val]: dummyNodeLicense[val] }),
                {},
            );
            this.draftManager.metadataChangeset.set('nodeLicense', props);
        } else {
            this.draftManager.metadataChangeset.set('nodeLicense', null);
        }
        this.draftManager.onMetadataInput.perform();
    }

    @action
    onInput() {
        this.draftManager.onMetadataInput.perform();
    }

    @action
    updateNodeLicense(key: string, event: Event) {
        const target = event.target as HTMLInputElement;
        const newNodeLicense = { ...this.draftManager.metadataChangeset.get('nodeLicense') };
        newNodeLicense[key] = target.value;
        set(this.draftManager.metadataChangeset, 'nodeLicense', newNodeLicense);
        this.onInput();
    }
}
