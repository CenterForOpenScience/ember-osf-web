import { attr } from '@ember-data/model';

import OsfModel from './osf-model';


/**
 * CedarMetadataRecordModel
 *
 * @description The cedar metadata record model
 */
export default class CedarMetadataRecordModel extends OsfModel {
    @attr('object') metadata!: any;
    @attr('boolean') isPublished!: boolean;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'cedar-metadata-record': CedarMetadataRecordModel;
    } // eslint-disable-line semi
}
