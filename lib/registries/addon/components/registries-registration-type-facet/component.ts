import EmberArray, { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import appConfig from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import ProviderModel from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import { SearchOptions } from 'registries/services/search';
import { ShareTermsFilter } from 'registries/services/share-search';
import template from './template';

const {
    featureFlagNames: {
        enableInactiveSchemas,
    },
} = appConfig;

@layout(template)
export default class RegistriesRegistrationTypeFacet extends Component {
    @service intl!: Intl;
    @service toast!: Toast;
    @service store!: DS.Store;
    @service analytics!: Analytics;
    @service features!: Features;

    searchOptions!: SearchOptions;
    provider?: ProviderModel;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    registrationTypes: EmberArray<string> = A([]);

    @task({ on: 'init' })
    @waitFor
    async fetchRegistrationTypes() {
        try {
            const metaschemas = await this.store.query('registration-schema', {
                'page[size]': 100,
            });
            const metaschemaNames = metaschemas.mapBy('name');
            if (!this.features.isEnabled(enableInactiveSchemas)) {
                metaschemaNames.push(
                    // Manually add 'Election Research Preacceptance Competition' to the list of possible
                    // facets. Metaschema was removed from the API as a possible registration type
                    // but should still be searchable
                    'Election Research Preacceptance Competition',
                );
            }
            this.set('registrationTypes', A(metaschemaNames.sort()));
        } catch (e) {
            const errorMessage = this.intl.t('registries.facets.registration_type.registration_schema_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }

    get title() {
        return this.intl.t('registries.facets.registration_type.title');
    }

    @computed('searchOptions')
    get onlyOSF() {
        const osfSelected = this.searchOptions.filters.find(
            item => item instanceof ShareTermsFilter
                && item.key === 'sources'
                && item.value === 'OSF Registries',
        );
        return this.searchOptions.filters.filter(filter => filter.key === 'sources').size === 1 && osfSelected;
    }

    @computed('searchOptions', 'registrationTypes')
    get types() {
        return this.registrationTypes.map(name => {
            const filter = new ShareTermsFilter('registration_type', name, name);

            return {
                name,
                filter,
                checked: this.searchOptions.filters.contains(filter),
            };
        });
    }

    @action
    typeChecked(filter: ShareTermsFilter, checked: boolean) {
        if (!this.onlyOSF) {
            return undefined;
        }

        if (this.provider) {
            this.analytics.track(
                'filter',
                checked
                    ? 'remove'
                    : 'add',
                `Discover - type ${filter.display} ${this.provider.name}`,
            );
        } else {
            this.analytics.track('filter', checked ? 'remove' : 'add', `Discover - type ${filter.display}`);
        }

        if (checked) {
            return this.onSearchOptionsUpdated(this.searchOptions.removeFilters(filter));
        }

        return this.onSearchOptionsUpdated(this.searchOptions.addFilters(filter));
    }
}
