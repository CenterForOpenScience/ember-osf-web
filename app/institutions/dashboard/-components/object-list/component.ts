import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import InstitutionModel from 'ember-osf-web/models/institution';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { Filter } from 'osf-components/components/search-page/component';

interface ValueColumn {
    name: string;
    getValue(searchResult: SearchResultModel): string;
}

interface LinkColumn {
    name: string;
    getHref(searchResult: SearchResultModel): string;
    getLinkText(searchResult: SearchResultModel): string;
    type: 'link';
}

interface ComponentColumn {
    name: string;
    type: 'doi' | 'contributors';
}

export type ObjectListColumn = ValueColumn | LinkColumn | ComponentColumn;

interface InstitutionalObjectListArgs {
    institution: InstitutionModel;
    defaultQueryOptions: Record<'cardSearchFilter', Record<string, string[]>>;
    columns: ObjectListColumn[];
    objectType: string;
}

export default class InstitutionalObjectList extends Component<InstitutionalObjectListArgs> {
    @tracked activeFilters: Filter[] = [];
    @tracked page = ''; // TODO: ENG-6184 Implement pagination
    @tracked sort = '-relevance'; // TODO: ENG-6184 Implement sorting

    get queryOptions() {
        const options = {
            ... this.args.defaultQueryOptions,
            'page[cursor]': this.page,
            'page[size]': 10, // TODO: ENG-6184 Implement pagination
            sort: this.sort,

        };
        const fullQueryOptions = this.activeFilters.reduce((acc, filter: Filter) => {
            const currentValue = acc.cardSearchFilter[filter.propertyPathKey];
            acc.cardSearchFilter[filter.propertyPathKey] =
                currentValue ? [...currentValue, filter.value] : [filter.value];
            return acc;
        }, options);
        return fullQueryOptions;
    }

    @action
    toggleFilter(property: Filter) {
        if (this.activeFilters.includes(property)) {
            this.activeFilters.removeObject(property);
        } else {
            this.activeFilters.pushObject(property);
        }
    }
}
