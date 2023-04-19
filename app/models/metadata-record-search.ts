import Model, { AsyncBelongsTo, AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';

import MetadataPropertySearchModel from './metadata-property-search';
import SearchResultModel from './search-result';

export interface SearchFilter {
    propertyPath: string;
    filterValue: string[];
    filterType?: string;
}

export default class MetadataRecordSearchModel extends Model {
    @attr('string') recordSearchText!: string;
    @attr('array') recordSearchFilters!: SearchFilter[];
    @attr('number') totalResultCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];

    @belongsTo('metadata-property-search', { inverse: null })
    relatedPropertySearch!: AsyncBelongsTo<MetadataPropertySearchModel> & MetadataPropertySearchModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'metadata-record-search': MetadataRecordSearchModel;
    } // eslint-disable-line semi
}
