import { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';
import { is, OrderedSet } from 'immutable';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import ProviderModel from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import { SearchFilter, SearchOptions } from 'registries/services/search';
import template from './template';

function includesImmutable(someArray: unknown[], someValue: unknown) {
    return someArray.any(val => is(val, someValue));
}

@layout(template)
@localClassNames('Sidebar')
export default class SideBar extends Component {
    @service analytics!: Analytics;

    searchOptions!: SearchOptions;
    additionalFilters!: SearchFilter[];
    provider?: ProviderModel;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    @computed('additionalFilters', 'searchOptions.filters')
    get filters() {
        const filters = A<any>([]);
        for (const filter of this.searchOptions.filters) {
            if (!includesImmutable(this.additionalFilters, filter)) {
                filters.addObject({
                    filter,
                    display: filter.display,
                });
            }
        }
        return filters;
    }

    @action
    _onSearchOptionsUpdated(options: SearchOptions) {
        this.onSearchOptionsUpdated(options);
    }

    @action
    removeFilter(filter: SearchFilter) {
        if (this.provider) {
            this.analytics.click('link', `Discover - Remove Filter ${this.provider.name}`, filter);
        } else {
            this.analytics.click('link', 'Discover - Remove Filter', filter);
        }
        this.onSearchOptionsUpdated(this.searchOptions.removeFilters(filter));
    }

    @action
    clearFilters() {
        this.analytics.track('button', 'click', 'Discover - Clear Filters');
        this.onSearchOptionsUpdated(this.searchOptions.set('filters', OrderedSet()));
    }
}
