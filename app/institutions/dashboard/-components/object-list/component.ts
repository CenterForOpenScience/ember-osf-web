import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import InstitutionModel from 'ember-osf-web/models/institution';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { Filter } from 'osf-components/components/search-page/component';

interface Column {
    name: string;
    sortKey?: string;
}
interface ValueColumn extends Column {
    getValue(searchResult: SearchResultModel): string;
}

interface LinkColumn extends Column {
    getHref(searchResult: SearchResultModel): string;
    getLinkText(searchResult: SearchResultModel): string;
    type: 'link';
}

interface ComponentColumn extends Column {
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
    @tracked page = '';
    @tracked sort = '-dateModified';
    @tracked visibleColumns = this.args.columns.map(column => column.name);
    @tracked dirtyVisibleColumns = [...this.visibleColumns]; // track changes to visible columns before they are saved

    get queryOptions() {
        const options = {
            cardSearchFilter: {
                ...this.args.defaultQueryOptions.cardSearchFilter,
            },
            'page[cursor]': this.page,
            'page[size]': 10,
            sort: this.sort,

        };
        const fullQueryOptions = this.activeFilters.reduce((acc, filter: Filter) => {
            const currentValue = acc.cardSearchFilter[filter.propertyPathKey];
            acc.cardSearchFilter[filter.propertyPathKey] =
                currentValue ? currentValue.concat(filter.value) : [filter.value];
            return acc;
        }, options);
        return fullQueryOptions;
    }

    get valueSearchQueryOptions() {
        const { defaultQueryOptions } = this.args;
        return {
            ...defaultQueryOptions.cardSearchFilter,
        };
    }

    @action
    updateVisibleColumns() {
        this.visibleColumns = [...this.dirtyVisibleColumns];
    }

    @action
    resetColumns() {
        this.dirtyVisibleColumns = [...this.visibleColumns];
    }

    @action
    toggleColumnVisibility(columnName: string) {
        if (this.dirtyVisibleColumns.includes(columnName)) {
            this.dirtyVisibleColumns.removeObject(columnName);
        } else {
            this.dirtyVisibleColumns.pushObject(columnName);
        }
    }

    @action
    toggleFilter(property: Filter) {
        if (this.activeFilters.includes(property)) {
            this.activeFilters.removeObject(property);
        } else {
            this.activeFilters.pushObject(property);
        }
    }

    @action
    updateSortKey(newSortKey: string) {
        if (this.sort === newSortKey) {
            this.sort = '-' + newSortKey;
        } else {
            this.sort = newSortKey;
        }
    }

    @action
    updatePage(newPage: string) {
        this.page = newPage;
    }
}
