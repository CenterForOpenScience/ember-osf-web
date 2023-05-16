import Model, { AsyncHasMany, AsyncBelongsTo, attr, belongsTo, hasMany } from '@ember-data/model';

import IndexPropertySearchModel from './index-property-search';
import { SearchFilter } from './index-card-search';
import SearchResultModel from './search-result';

export default class IndexValueSearchModel extends Model {
    @attr('string') valueSearchText!: string;
    @attr('array') valueSearchFilter!: SearchFilter[];
    @attr('string') cardSearchText!: string;
    @attr('array') cardSearchFilter!: SearchFilter[];
    @attr('number') totalResultCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];

    @belongsTo('index-property-search', { inverse: null })
    relatedPropertySearch!: AsyncBelongsTo<IndexPropertySearchModel> & IndexPropertySearchModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-value-search': IndexValueSearchModel;
    } // eslint-disable-line semi
}
