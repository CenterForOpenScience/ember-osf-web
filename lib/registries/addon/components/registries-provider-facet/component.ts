import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import EmberArray, { A } from '@ember/array';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import { SearchFilter, SearchOptions } from 'registries/services/search';
import template from './template';

@layout(template)
@localClassNames('SourcesFacet')
export default class RegistriesSourcesFacet extends Component {
    @service analytics!: Analytics;

    searchOptions!: SearchOptions;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    title = 'Provider';
    options: EmberArray<{
        count: number,
        filter: SearchFilter,
    }> = defaultTo(this.options, A([]));

    @computed('options', 'searchOptions')
    get providers() {
        return this.options.map(option => ({
            ...option,
            checked: this.searchOptions.filters.has(option.filter),
        }));
    }

    @action
    providerChecked(filter: SearchFilter, remove: boolean) {
        this.analytics.track('filter', remove ? 'remove' : 'add', `Discover - providers ${filter.display}`);

        if (remove) {
            this.onSearchOptionsUpdated(this.searchOptions.removeFilters(filter));
        } else {
            this.onSearchOptionsUpdated(this.searchOptions.addFilters(filter));
        }
    }
}
