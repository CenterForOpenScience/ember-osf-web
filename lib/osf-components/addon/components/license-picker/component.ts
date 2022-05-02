import Store from '@ember-data/store';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Provider from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

import ValidatedModelForm from 'osf-components/components/validated-model-form/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class LicensePicker extends Component {
    @service analytics!: Analytics;
    @service store!: Store;
    @service theme!: Theme;
    @service intl!: Intl;

    form?: ValidatedModelForm<'node'>;
    node!: Node;
    placeholder = this.intl.t('registries.registration_metadata.select_license');

    showText = false;
    licensesAcceptable!: QueryHasManyResult<License>;
    helpLink = 'https://help.osf.io/';

    @alias('theme.provider') provider!: Provider;
    @alias('node.license') selected!: License;

    @sort('selected.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @restartableTask
    @waitFor
    async queryLicenses(name?: string) {
        if (name) {
            await timeout(500);
        }

        const licensesAcceptable = await this.provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
                filter: name ? { name } : undefined,
            });

        await this.node.license;

        this.setProperties({ licensesAcceptable });

        this.node.notifyPropertyChange('license');

        return licensesAcceptable;
    }

    @action
    changeLicense(selected: License) {
        this.node.setNodeLicenseDefaults(selected.requiredFields);
    }

    @action
    updateNodeLicense(key: string, event: Event) {
        if (this.form) {
            const target = event.target as HTMLInputElement;
            const newNodeLicense = { ...this.form.changeset.get('nodeLicense') } as { [key: string]: string };
            newNodeLicense[key] = target.value;
            this.form.changeset.set('nodeLicense', newNodeLicense);
        }
    }

    didReceiveAttrs() {
        super.didReceiveAttrs();
        taskFor(this.queryLicenses).perform();
    }
}
