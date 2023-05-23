import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import { SearchFilter } from './index-card-search';
import SearchResultModel from './search-result';

export default class IndexPropertySearchModel extends Model {
    @attr('string') propertySearchText!: string;
    @attr('array') propertySearchFilter!: SearchFilter[];
    @attr('string') cardSearchText!: string;
    @attr('array') cardSearchFilter!: SearchFilter[];
    @attr('number') totalResultCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-property-search': IndexPropertySearchModel;
    } // eslint-disable-line semi
}
