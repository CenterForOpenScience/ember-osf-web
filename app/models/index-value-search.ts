import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import { SearchFilter } from './index-card-search';
import SearchResultModel from './search-result';

export default class IndexValueSearchModel extends Model {
    @attr('string') valueSearchText!: string;
    @attr('string') valueSearchPropertyPath!: string;
    @attr('string') cardSearchText!: string;
    @attr('array') cardSearchFilter!: SearchFilter[];
    @attr('number') totalResultCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-value-search': IndexValueSearchModel;
    } // eslint-disable-line semi
}
