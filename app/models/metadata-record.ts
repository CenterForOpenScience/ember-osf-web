import { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';

export interface LanguageText {
    '@language': string;
    '@value': string;
}

export default class MetadataRecordModel extends OsfModel {
    @attr('array') resourceType!: string[];
    @attr('array') resourceIdentifier!: string[];
    @attr('object') resourceMetadata!: any;

    @hasMany('metadata-record-search', { inverse: null })
    relatedRecords!: AsyncHasMany<MetadataRecordModel> & MetadataRecordModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'metadata-record': MetadataRecordModel;
    } // eslint-disable-line semi
}
