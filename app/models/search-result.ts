import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import MetadataRecordModel from 'ember-osf-web/models/metadata-record';

import OsfModel from './osf-model';

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

export default class SearchResultModel extends OsfModel {
    @attr('array') matchEvidence!: Array<IriMatchEvidence | TextMatchEvidence>;
    @attr('number') recordResultCount!: number;

    @belongsTo('metadata-record', { inverse: null })
    metadataRecord!: AsyncBelongsTo<MetadataRecordModel> | MetadataRecordModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'search-result': SearchResultModel;
    } // eslint-disable-line semi
}
