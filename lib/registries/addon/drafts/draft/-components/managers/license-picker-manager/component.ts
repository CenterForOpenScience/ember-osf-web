import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias, not, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import { ChangesetDef } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import License from 'ember-osf-web/models/license';
import { NodeLicense } from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';

import template from './template';

@tagName('')
@layout(template)
export default class LicensePickerManager extends Component {
    @service store!: DS.Store;

    // required
    changeset!: ChangesetDef;
    model!: DraftRegistration;

    // private
    licensesAcceptable!: QueryHasManyResult<License>;
    currentLicense!: License;
    currentNodeLicense!: NodeLicense;

    @alias('model.license') selectedLicense!: License;
    @not('currentLicense') fieldIsEmpty!: License;

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
        const provider = yield this.model.provider;

        if (!provider) {
            return;
        }

        const providerLicenses: QueryHasManyResult<License> = yield provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
            });

        this.setProperties({
            licensesAcceptable: providerLicenses,
            currentLicense: yield this.model.license,
            currentNodeLicense: { ...this.model.nodeLicense },
        });
    });

    @action
    changeLicense(selected: License) {
        this.set('selectedLicense', selected);
        this.model.setNodeLicenseDefaults(selected.requiredFields);
        this.changeset.set('license', selected);
        this.changeset.set('nodeLicense', this.model.nodeLicense);
    }

    @action
    noop() {
        // Nothing to see here
    }
}
