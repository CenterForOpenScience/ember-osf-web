import Model, { AsyncHasMany, AsyncBelongsTo, attr, belongsTo, hasMany } from '@ember-data/model';

import MetadataPropertySearchModel from './metadata-property-search';
import { SearchFilter } from './metadata-record-search';
import SearchResultModel from './search-result';

export default class MetadataValueSearchModel extends Model {
    @attr('string') valueSearchText!: string;
    @attr('array') valueSearchFilter!: SearchFilter[];
    @attr('string') recordSearchText!: string;
    @attr('array') recordSearchFilter!: SearchFilter[];
    @attr('number') totalResultCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];

    @belongsTo('metadata-property-search', { inverse: null })
    relatedPropertySearch!: AsyncBelongsTo<MetadataPropertySearchModel> & MetadataPropertySearchModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'metadata-value-search': MetadataValueSearchModel;
    } // eslint-disable-line semi
}
