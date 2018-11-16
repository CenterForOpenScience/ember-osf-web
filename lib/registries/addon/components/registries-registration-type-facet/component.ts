import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import EmberArray, { A } from '@ember/array';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import RegistrationSchema from 'ember-osf-web/adapters/registration-schema';
import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import config from 'registries/config/environment';
import { SearchOptions } from 'registries/services/search';
import { ShareTermsFilter } from 'registries/services/share-search';
import template from './template';

@layout(template)
export default class RegistriesRegistrationTypeFacet extends Component.extend({
    fetchRegistrationTypes: task(function *(this: RegistriesRegistrationTypeFacet): any {
        try {
            const metaschemas: RegistrationSchema[] = yield this.store.findAll('registration-schema');

            this.set('registrationTypes', A(
                metaschemas.mapBy('name').concat([
                    // Manually add 'Election Research Preacceptance Competition' to the list of possible
                    // facets. Metaschema was removed from the API as a possible registration type
                    // but should still be searchable
                    'Election Research Preacceptance Competition',
                ]).sort(),
            ));
        } catch (e) {
            this.toast.error(this.i18n.t('registries.facets.registration_type.registration_schema_error'));
        }
    }).on('init'),
}) {
    @service i18n!: I18N;
    @service toast!: Toast;
    @service store!: DS.Store;
    @service analytics!: Analytics;

    searchOptions!: SearchOptions;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    registrationTypes: EmberArray<string> = defaultTo(this.registrationTypes, A([]));

    get title() {
        return this.i18n.t('registries.facets.registration_type.title');
    }

    @computed('searchOptions')
    get onlyOSF() {
        return this.searchOptions.filters.filter(filter => filter.key === 'sources').size === 1
        && this.searchOptions.filters.contains(
            new ShareTermsFilter('sources', 'OSF', config.sourcesWhitelist.find(x => x.name === 'OSF')!.display!),
        );
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
            return;
        }

        this.analytics.track('filter', checked ? 'remove' : 'add', `Discover - type ${filter.display}`);

        if (checked) {
            return this.onSearchOptionsUpdated(this.searchOptions.removeFilters(filter));
        }

        return this.onSearchOptionsUpdated(this.searchOptions.addFilters(filter));
    }
}
