import EmberArray, { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import ProviderModel from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import { SearchFilter, SearchOptions } from 'registries/services/search';
import template from './template';

@layout(template)
@localClassNames('SourcesFacet')
export default class RegistriesSourcesFacet extends Component {
    @service analytics!: Analytics;

    searchOptions!: SearchOptions;
    provider?: ProviderModel;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    title = 'Provider';
    options: EmberArray<{
        count: number,
        filter: SearchFilter,
    }> = A([]);

    @computed('options', 'searchOptions.filters')
    get providers() {
        return this.options.map(option => ({
            ...option,
            checked: this.searchOptions.filters.has(option.filter),
        }));
    }

    @computed('options.length')
    get shouldLinkToAggregateDiscover() {
        return this.options.length === 1;
    }

    @action
    providerChecked(filter: SearchFilter, remove: boolean) {
        if (this.provider) {
            this.analytics.track(
                'filter',
                remove
                    ? 'remove'
                    : 'add',
                `Discover - providers ${filter.display} ${this.provider.name}`,
            );
        } else {
            this.analytics.track('filter', remove ? 'remove' : 'add', `Discover - providers ${filter.display}`);
        }
        if (remove) {
            this.onSearchOptionsUpdated(this.searchOptions.removeFilters(filter));
        } else {
            this.onSearchOptionsUpdated(this.searchOptions.addFilters(filter));
        }
    }
}
