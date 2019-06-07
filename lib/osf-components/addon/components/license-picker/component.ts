import { action } from '@ember-decorators/object';
import { alias, sort } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

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
export default class LicensePicker extends Component.extend({
    didReceiveAttrs(this: LicensePicker, ...args: any[]) {
        this._super(...args);
        this.get('queryLicenses').perform();
    },

    queryLicenses: task(function *(this: LicensePicker, name?: string) {
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
    }).restartable(),
}) {
    @service analytics!: Analytics;
    @service i18n!: I18N;
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

    @action
    changeLicense(this: LicensePicker, selected: License) {
        this.node.setNodeLicenseDefaults(selected.requiredFields);
    }

    /**
     * Calling notifyPropertyChange doesn't trigger dirty attributes
     */
    @action
    notify(this: LicensePicker) {
        // TODO: find a better way to set propertyDidChange
        this.node.set('nodeLicense', { ...this.node.nodeLicense });
    }
}
