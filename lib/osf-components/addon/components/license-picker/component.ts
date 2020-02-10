import Component from '@ember/component';
import { action } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Provider from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class LicensePicker extends Component {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service theme!: Theme;

    showText: boolean = false;
    node: Node = this.node;
    licensesAcceptable!: QueryHasManyResult<License>;
    helpLink: string = 'https://openscience.zendesk.com/hc/en-us/articles/360019739014';

    @alias('theme.provider') provider!: Provider;
    @alias('node.license') selected!: License;

    @sort('selected.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @task({ restartable: true })
    queryLicenses = task(function *(this: LicensePicker, name?: string) {
        if (name) {
            yield timeout(500);
        }

        const licensesAcceptable: QueryHasManyResult<License> = yield this.provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
                filter: name ? { name } : undefined,
            });

        yield this.node.license;

        this.setProperties({ licensesAcceptable });

        this.node.notifyPropertyChange('license');

        return licensesAcceptable;
    });

    @action
    changeLicense(selected: License) {
        this.node.setNodeLicenseDefaults(selected.requiredFields);
    }

    /**
     * Calling notifyPropertyChange doesn't trigger dirty attributes
     */
    @action
    notify() {
        // TODO: find a better way to set propertyDidChange
        this.node.set('nodeLicense', { ...this.node.nodeLicense });
    }

    didReceiveAttrs(...args: any[]) {
        this._super(...args);
        this.queryLicenses.perform();
    }
}
