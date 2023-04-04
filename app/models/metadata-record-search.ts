import { AsyncBelongsTo, AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';

import MetadataPropertySearchModel from './metadata-property-search';
import OsfModel from './osf-model';
import SearchMatchModel from './search-match';

export interface SearchFilter {
    propertyPath: string;
    filterValue: string[];
    filterType?: string;
}

export default class MetadataRecordSearchModel extends OsfModel {
    @attr('string') searchText!: string;
    @attr('array') searchFilters!: SearchFilter[];
    @attr('number') totalMatchCount!: number;

    @hasMany('search-match', { inverse: null })
    matchingSamples!: AsyncHasMany<SearchMatchModel> & SearchMatchModel[];

    @belongsTo('related-property-search', { inverse: null })
    relatedPropertySearch!: AsyncBelongsTo<MetadataPropertySearchModel> & MetadataPropertySearchModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'metadata-record-search': MetadataRecordSearchModel;
    } // eslint-disable-line semi
}
