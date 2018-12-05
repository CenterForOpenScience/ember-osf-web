import { action, computed } from '@ember-decorators/object';
import { alias, sort } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Component from '@ember/component';
import EmberObject from '@ember/object';
import { task, timeout } from 'ember-concurrency';
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
    @service intl!: Intl;
    @service store!: DS.Store;
    @service theme!: Theme;

    showText: boolean = false;
    node: Node = this.node;
    licensesAcceptable!: QueryHasManyResult<License>;
    helpLink: string = 'http://help.osf.io/m/60347/l/611430-licensing';

    @alias('theme.provider') provider!: Provider;
    @alias('node.license') selected!: License;

    @sort('selected.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    /**
     * This replaces the placeholders, e.g. `{{field}}`, in the license text (which acts as a template)
     * TODO: Dynamic computed properties. `year` and `copyrightHolders` are the only two acceptable fields on
     * nodeLicense, currently.
     */
    @computed('selected.{text,requiredFields.length}', 'node.nodeLicense.{year,copyrightHolders}')
    get licenseText(): string {
        const requiredFields = this.selected.get('requiredFields');
        const result = this.selected.get('text') || '';

        if (!this.node.nodeLicense || !(requiredFields && requiredFields.length)) {
            return result;
        }

        return Object.entries(this.node.nodeLicense).reduce(
            (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`), value),
            result,
        );
    }

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
        this.node.set('nodeLicense', EmberObject.create({ ...this.node.nodeLicense }));
    }
}
