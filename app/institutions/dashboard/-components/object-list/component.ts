import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import InstitutionModel from 'ember-osf-web/models/institution';
import { SuggestedFilterOperators } from 'ember-osf-web/models/related-property-path';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { Filter } from 'osf-components/components/search-page/component';

interface Column {
    name: string;
    sortKey?: string;
    sortParam?: string;
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
    defaultQueryOptions: Record<'cardSearchFilter', Record<string, string[] | any>>;
    columns: ObjectListColumn[];
    objectType: string;
}

export default class InstitutionalObjectList extends Component<InstitutionalObjectListArgs> {
    @tracked activeFilters: Filter[] = [];
    @tracked page = '';
    @tracked sort = '-dateModified';
    @tracked sortParam?: string;
    @tracked visibleColumns = this.args.columns.map(column => column.name);
    @tracked dirtyVisibleColumns = [...this.visibleColumns]; // track changes to visible columns before they are saved

    get queryOptions() {
        const options = {
            cardSearchFilter: {
                ...this.args.defaultQueryOptions.cardSearchFilter,
            },
            'page[cursor]': this.page,
            'page[size]': 10,
            // sort can look like `sort=dateFieldName` or `sort[integer-value]=fieldName` if sortParam is provided
            sort: this.sortParam ? { [this.sortParam]: this.sort } : this.sort,
        };
        const fullQueryOptions = this.activeFilters.reduce((acc, filter: Filter) => {
            if (filter.suggestedFilterOperator === SuggestedFilterOperators.IsPresent) {
                acc.cardSearchFilter[filter.propertyPathKey] = {};
                acc.cardSearchFilter[filter.propertyPathKey][filter.value] = true;
                return acc;
            }
            const currentValue = acc.cardSearchFilter[filter.propertyPathKey];
            acc.cardSearchFilter[filter.propertyPathKey] =
                currentValue ? currentValue.concat(filter.value) : [filter.value];
            return acc;
        }, options);
        return fullQueryOptions;
    }

    get valueSearchQueryOptions() {
        return {
            ...this.queryOptions.cardSearchFilter,
        };
    }

    downloadUrl(format: string) {
        const searchUrl = new URL('test');
        searchUrl.searchParams.append('acceptMediatype', format);
        const fileName = `${this.args.institution.name}-${this.args.objectType}-search-results`; // Extension?
        searchUrl.searchParams.append('withFileName', fileName);
        return searchUrl.toString();
    }

    get downloadCsvUrl() {
        return this.downloadUrl('text/csv');
    }

    get downloadTsvUrl() {
        return this.downloadUrl('text/tab-separated-values');
    }

    get downloadJsonUrl() {
        return this.downloadUrl('application/json');
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
        this.page = '';
        if (this.activeFilters.includes(property)) {
            this.activeFilters.removeObject(property);
        } else {
            this.activeFilters.pushObject(property);
        }
    }

    @action
    updateSortKey(newSortKey: string, newSortParam?: string) {
        this.sortParam = newSortParam;
        this.page = '';
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
