import { classNames } from '@ember-decorators/component';
import { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';
import { OrderedSet } from 'immutable';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import { SearchFilter, SearchOptions } from 'ember-osf-web/services/search';
import defaultTo from 'ember-osf-web/utils/default-to';

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
    clearFilters() {
        this.analytics.track('button', 'click', 'Discover - Clear Filters');
        this.onSearchOptionsUpdated(this.searchOptions.set('filters', OrderedSet()));
    }
}
