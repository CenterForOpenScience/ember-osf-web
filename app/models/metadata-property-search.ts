import { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import { SearchFilter } from './metadata-record-search';
import OsfModel from './osf-model';
import SearchMatchModel from './search-match';

export default class MetadataPropertySearchModel extends OsfModel {
    @attr('string') propertySearchText!: string;
    @attr('array') propertySearchFilter!: SearchFilter[];
    @attr('string') recordSearchText!: string;
    @attr('array') recordSearchFilter!: SearchFilter[];
    @attr('number') totalMatchCount!: number;

    @hasMany('search-match', { inverse: null })
    matchingSamples!: AsyncHasMany<SearchMatchModel> & SearchMatchModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'metadata-property-search': MetadataPropertySearchModel;
    } // eslint-disable-line semi
}
