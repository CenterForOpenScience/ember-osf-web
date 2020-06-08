import { classNames } from '@ember-decorators/component';
import { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';
import { is, OrderedSet } from 'immutable';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import { SearchFilter, SearchOptions } from 'registries/services/search';
import template from './template';

function includesImmutable(someArray: unknown[], someValue: unknown) {
    return someArray.any(val => is(val, someValue));
}

@layout(template)
@localClassNames('Sidebar')
@classNames('col-sm-3', 'col-xs-12')
export default class SideBar extends Component {
    @service analytics!: Analytics;

    searchOptions!: SearchOptions;
    additionalFilters!: SearchFilter[];
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    @computed('searchOptions')
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
        this.onSearchOptionsUpdated(this.searchOptions.removeFilters(filter));
    }

    @action
    clearFilters() {
        this.analytics.track('button', 'click', 'Discover - Clear Filters');
        this.onSearchOptionsUpdated(this.searchOptions.set('filters', OrderedSet()));
    }
}
