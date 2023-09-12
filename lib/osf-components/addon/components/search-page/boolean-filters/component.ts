import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import IntlService from 'ember-intl/services/intl';
import RelatedPropertyPathModel from 'ember-osf-web/models/related-property-path';

import { Filter } from '../component';

interface BooleanFiltersArgs {
    cardSearchText: string;
    cardSearchFilter: Filter[];
    properties: RelatedPropertyPathModel[];
    toggleFilter: (filter: Filter) => void;
}

export default class BooleanFilters extends Component<BooleanFiltersArgs> {
    @service intl!: IntlService;

    @tracked collapsed = true;

    get visibleLabel() {
        return this.intl.t('search.boolean-filters.dropdown-label');
    }

    get hasFilterableValues() {
        return this.args.properties.some(property => property.cardSearchResultCount > 0);
    }

    get filterableValues() {
        return this.args.properties.filterBy('cardSearchResultCount').sortBy('cardSearchResultCount').reverse();
    }

    @action
    toggleFacet() {
        this.collapsed = !this.collapsed;
    }
}
