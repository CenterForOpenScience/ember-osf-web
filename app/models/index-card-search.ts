import Model, { AsyncBelongsTo, AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';

import IndexPropertySearchModel from './index-property-search';
import SearchResultModel from './search-result';

export interface SearchFilter {
    propertyPath: string;
    filterValue: string[];
    filterType?: string;
}

export default class IndexCardSearchModel extends Model {
    @attr('string') cardSearchText!: string;
    @attr('array') cardSearchFilters!: SearchFilter[];
    @attr('number') totalResultCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];

    @belongsTo('index-property-search', { inverse: null })
    relatedPropertySearch!: AsyncBelongsTo<IndexPropertySearchModel> & IndexPropertySearchModel;

    get firstPage() {
        return this.searchResultPage.links.first.href;
    }

    get prevPage() {
        return this.searchResultPage.links.prev.href;
    }

    get nextPage() {
        return this.searchResultPage.links.next.href;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-card-search': IndexCardSearchModel;
    } // eslint-disable-line semi
}
