import { classNames } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';
import { OrderedSet } from 'immutable';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import { SearchFilter, SearchOptions } from 'registries/services/search';
import template from './template';

@layout(template)
@localClassNames('Sidebar')
@classNames('col-sm-4', 'col-xs-12')
export default class SideBar extends Component {
    @service analytics!: Analytics;

    searchOptions!: SearchOptions;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;
    filterStyles: {[key: string]: string | undefined} = defaultTo(this.filterStyles, {});

    @computed('searchOptions')
    get filters() {
        const filters = A<any>([]);
        for (const filter of this.searchOptions.filters) {
            filters.addObject({
                filter,
                class: this.filterStyles[filter.key],
                display: filter.display,
            });
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
    clearFilters(this: SideBar) {
        this.analytics.track('button', 'click', 'Discover - Clear Filters');
        this.onSearchOptionsUpdated(this.searchOptions.set('filters', OrderedSet()));
    }
}
