import { AsyncHasMany, AsyncBelongsTo, attr, belongsTo, hasMany } from '@ember-data/model';

import MetadataPropertySearchModel from './metadata-property-search';
import { SearchFilter } from './metadata-record-search';
import SearchResultModel from './search-result';
import OsfModel from './osf-model';

export default class MetadataValueSearchModel extends OsfModel {
    @attr('string') valueSearchText!: string;
    @attr('array') valueSearchFilter!: SearchFilter[];
    @attr('string') recordSearchText!: string;
    @attr('array') recordSearchFilter!: SearchFilter[];
    @attr('number') totalMatchCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];

    @belongsTo('related-property-search', { inverse: null })
    relatedPropertySearch!: AsyncBelongsTo<MetadataPropertySearchModel> & MetadataPropertySearchModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'metadata-value-search': MetadataValueSearchModel;
    } // eslint-disable-line semi
}
