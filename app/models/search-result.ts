import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import IndexCardModel from './index-card';

export interface IriMatchEvidence {
    '@type': 'IriMatchEvidence';
    matchingIri: string;
    propertyPath: string[];
}

export interface TextMatchEvidence {
    '@type': 'TextMatchEvidence';
    matchingHighlight: string;
    propertyPath: string[];
}

export default class SearchResultModel extends Model {
    @attr('array') matchEvidence!: Array<IriMatchEvidence | TextMatchEvidence>;
    @attr('number') recordResultCount!: number;

    @belongsTo('index-card', { inverse: null })
    indexCard!: AsyncBelongsTo<IndexCardModel> | IndexCardModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'search-result': SearchResultModel;
    } // eslint-disable-line semi
}
